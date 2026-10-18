"use client";

import { useSyncExternalStore } from "react";
import { sha256 } from "./sha256";
import { BADGES, type BadgeContext } from "./badges";
import {
  GUEST,
  emptyUserData,
  type Account,
  type Activity,
  type AppNotification,
  type AppState,
  type UserData,
} from "./types";
import { MODULE_LESSON_KEYS } from "@/content/school-outline";
import { cloudEnabled, friendlyAuthError, mergeUserData, pullMember, pushMember, sb } from "./cloud";

/*
 * The 23percent club client store.
 *
 * Accounts, progress and trackers live on this device (localStorage), under
 * one versioned key. Every write goes through `commit`, which persists,
 * re-evaluates badges and notifies subscribers. When Supabase is configured,
 * signed-in accounts are also synced to the server (see cloud.ts); the rest of
 * the app talks only to the actions below.
 */

const KEY = "23club:v1";

const initial: AppState = { v: 1, accounts: {}, session: null, profiles: {} };
let state: AppState = initial;
let loaded = false;
const listeners = new Set<() => void>();
const badgeCtx: BadgeContext = { moduleLessons: MODULE_LESSON_KEYS };

function read(): AppState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as AppState;
    if (parsed?.v !== 1) return initial;
    // Backfill fields added after a profile was first written.
    const profiles: Record<string, UserData> = {};
    for (const [k, p] of Object.entries(parsed.profiles ?? {})) profiles[k] = { ...emptyUserData(), ...p };
    return { ...initial, ...parsed, profiles };
  } catch {
    return initial;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked (private mode) — the session still works in memory */
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = read();
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    state = read();
    listeners.forEach((l) => l());
  });
  // Save pending changes as soon as the tab is hidden or the connection returns.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && state.session) void pushNow(state.session);
  });
  window.addEventListener("online", () => {
    if (state.session) void pushNow(state.session);
  });
}

function subscribe(l: () => void) {
  ensureLoaded();
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return initial;
}

export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot()),
  );
}

const EMPTY = emptyUserData();

function profileKey(s: AppState) {
  return s.session ?? GUEST;
}

/** The active user's data (guest or signed-in). Stable reference between writes. */
export function useProfile(): UserData {
  return useAppState((s) => s.profiles[profileKey(s)] ?? EMPTY);
}

export function useAccount(): Account | null {
  return useAppState((s) => (s.session ? (s.accounts[s.session] ?? null) : null));
}

/** False during SSR and the hydration pass; true once localStorage is read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/* A minute-resolution clock, so client views can use "now" without impure renders. */
let nowVal = 0;
let nowTimer: ReturnType<typeof setInterval> | undefined;
const nowSubs = new Set<() => void>();
function subscribeNow(cb: () => void) {
  nowSubs.add(cb);
  if (!nowTimer)
    nowTimer = setInterval(() => {
      nowVal = Date.now();
      nowSubs.forEach((f) => f());
    }, 60000);
  return () => {
    nowSubs.delete(cb);
    if (!nowSubs.size && nowTimer) {
      clearInterval(nowTimer);
      nowTimer = undefined;
    }
  };
}

/** Current time on the client (0 during SSR and hydration). */
export function useNow(): number {
  return useSyncExternalStore(
    subscribeNow,
    () => nowVal || (nowVal = Date.now()),
    () => 0,
  );
}

export function getProfile(): UserData {
  ensureLoaded();
  return state.profiles[profileKey(state)] ?? EMPTY;
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const now = () => new Date().toISOString();

/** Counts every change, so a finished upload knows whether newer edits arrived meanwhile. */
let rev = 0;
let pushTimer: ReturnType<typeof setTimeout> | undefined;

function commit(next: AppState, opts: { sync?: boolean } = {}) {
  state = next;
  if (opts.sync !== false) markDirty();
  persist();
  listeners.forEach((l) => l());
}

/* ——— Cloud sync (Supabase). A no-op unless the signed-in account is a cloud account. ——— */

function markDirty() {
  const key = state.session;
  const acct = key ? state.accounts[key] : null;
  if (!key || !acct?.cloud) return;
  rev++;
  if (!acct.dirty) state = { ...state, accounts: { ...state.accounts, [key]: { ...acct, dirty: true } } };
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void pushNow(key), 1500);
}

async function pushNow(key: string) {
  clearTimeout(pushTimer);
  const acct = state.accounts[key];
  if (!acct?.cloud || !acct.dirty) return;
  const startRev = rev;
  try {
    const at = await pushMember(acct.id, {
      name: acct.name,
      city: acct.city,
      ageBand: acct.ageBand,
      data: state.profiles[key] ?? emptyUserData(),
    });
    const cur = state.accounts[key];
    if (cur && rev === startRev) {
      commit({ ...state, accounts: { ...state.accounts, [key]: { ...cur, dirty: false, syncedAt: at } } }, { sync: false });
    }
  } catch {
    pushTimer = setTimeout(() => void pushNow(key), 15000); // offline or a hiccup: try again
  }
}

interface CloudUser {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: Record<string, unknown>;
}

/** Make a signed-in Supabase user the active account, merging server, device and guest data. */
async function adoptCloudUser(user: CloudUser, nameHint?: string) {
  ensureLoaded();
  const email = normEmail(user.email ?? "");
  const row = await pullMember(user.id);
  const existing = state.accounts[email];
  // Device changes that never reached the server (or a pre-cloud local account) must not be overwritten.
  const localUnsynced = existing ? (existing.cloud ? existing.id === user.id && !!existing.dirty : true) : false;
  const local = state.profiles[email];
  const guest = state.profiles[GUEST];

  let data: UserData;
  if (row) {
    const server = { ...emptyUserData(), ...row.data };
    data = localUnsynced && local ? mergeUserData(local, server) : server;
  } else {
    data = local ?? emptyUserData();
  }
  if (guest) data = mergeUserData(data, guest);

  const metaName = typeof user.user_metadata?.name === "string" ? (user.user_metadata.name as string) : "";
  const name = (localUnsynced && existing?.name) || row?.name || nameHint || metaName || email.split("@")[0] || "Member";
  if (!row && !local) {
    data = {
      ...data,
      notifications: [
        {
          id: uid(),
          title: `Welcome to 23percent club, ${name.split(" ")[0]}`,
          body: "Start with the financial health check. It shows which lessons will help you most.",
          href: "/know-yourself/health",
          at: now(),
          read: false,
          kind: "system",
        },
        ...data.notifications,
      ],
      activity: [{ id: uid(), kind: "account", label: "Created your 23percent club account", href: "/dashboard", at: now() }, ...data.activity],
    };
  }

  const account: Account = {
    id: user.id,
    name,
    email,
    createdAt: row?.created_at ?? user.created_at,
    city: (localUnsynced ? existing?.city : undefined) ?? row?.city ?? undefined,
    ageBand: (localUnsynced ? existing?.ageBand : undefined) ?? row?.age_band ?? undefined,
    cloud: true,
    dirty: !row || localUnsynced || !!guest,
    syncedAt: row?.updated_at,
  };
  const profiles = { ...state.profiles, [email]: data };
  delete profiles[GUEST];
  commit({ ...state, accounts: { ...state.accounts, [email]: account }, session: email, profiles }, { sync: false });
  if (account.dirty) void pushNow(email);
}

let cloudStarted = false;

/** Run once on page load: pick up an existing Supabase session and pull the latest saved data. */
export async function initCloud() {
  const c = sb();
  if (!c || cloudStarted) return;
  cloudStarted = true;
  ensureLoaded();
  try {
    const { data } = await c.auth.getSession();
    const user = data.session?.user;
    if (user) await adoptCloudUser(user);
    else if (state.session && state.accounts[state.session]?.cloud) commit({ ...state, session: null }, { sync: false });
  } catch {
    /* offline: keep working from this device's copy */
  }
  c.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && state.session && state.accounts[state.session]?.cloud) commit({ ...state, session: null }, { sync: false });
  });
}

type Recipe = (d: UserData) => Partial<UserData> | void;

/** Apply a change to the active profile, then award any newly earned badges. */
export function update(recipe: Recipe) {
  ensureLoaded();
  const key = profileKey(state);
  const current = state.profiles[key] ?? emptyUserData();
  const patch = recipe(current) ?? {};
  let next: UserData = { ...current, ...patch };

  const earned: string[] = [];
  for (const b of BADGES) {
    if (!next.badges[b.id] && b.test(next, badgeCtx)) earned.push(b.id);
  }
  if (earned.length) {
    const at = now();
    const badges = { ...next.badges };
    const notes: AppNotification[] = [];
    const acts: Activity[] = [];
    for (const id of earned) {
      badges[id] = at;
      const def = BADGES.find((b) => b.id === id)!;
      notes.push({ id: uid(), title: `Badge earned: ${def.name}`, body: def.description, href: "/dashboard/achievements", at, read: false, kind: "badge" });
      acts.push({ id: uid(), kind: "badge", label: `Earned the “${def.name}” badge`, href: "/dashboard/achievements", at });
    }
    next = {
      ...next,
      badges,
      notifications: [...notes, ...next.notifications].slice(0, 60),
      activity: [...acts, ...next.activity].slice(0, 200),
    };
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("club:toast", { detail: { title: notes[0]!.title, body: notes[0]!.body, tone: "gold" } }));
    }
  }

  commit({ ...state, profiles: { ...state.profiles, [key]: next } });
}

export function logActivity(kind: Activity["kind"], label: string, href?: string) {
  update((d) => ({ activity: [{ id: uid(), kind, label, href, at: now() }, ...d.activity].slice(0, 200) }));
}

export function notify(n: Omit<AppNotification, "id" | "at" | "read">) {
  update((d) => ({ notifications: [{ ...n, id: uid(), at: now(), read: false }, ...d.notifications].slice(0, 60) }));
}

export function toast(title: string, body?: string, tone: "default" | "gold" | "pos" = "default") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("club:toast", { detail: { title, body, tone } }));
}

export { uid, now };

/* ——— Accounts ——— */

const normEmail = (e: string) => e.trim().toLowerCase();

export type AuthResult = { ok: true; confirm?: boolean } | { ok: false; error: string };

export async function signUp(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  ensureLoaded();
  const email = normEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (input.name.trim().length < 2) return { ok: false, error: "Enter your name." };
  if (input.password.length < 8) return { ok: false, error: "Use at least 8 characters for your password." };

  const c = sb();
  if (c) {
    const { data, error } = await c.auth.signUp({
      email,
      password: input.password,
      options: { data: { name: input.name.trim() }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) return { ok: false, error: friendlyAuthError(error.message) };
    // With email confirmation on, an existing address comes back as a user with no identities.
    if (data.user && data.user.identities?.length === 0) return { ok: false, error: friendlyAuthError("already registered") };
    if (!data.session || !data.user) return { ok: true, confirm: true };
    try {
      await adoptCloudUser(data.user, input.name.trim());
    } catch {
      return { ok: false, error: "Your account was created but we couldn't save your profile. Log in to try again." };
    }
    return { ok: true };
  }

  if (state.accounts[email]) return { ok: false, error: "An account with this email already exists on this device. Log in instead." };

  const account: Account = {
    id: uid(),
    name: input.name.trim(),
    email,
    passHash: sha256(`${email}:${input.password}`),
    createdAt: now(),
  };
  // Anything done as a guest (lessons, calculators, diagnostics) moves into the new account.
  const guest = state.profiles[GUEST] ?? emptyUserData();
  const welcome: AppNotification = {
    id: uid(),
    title: `Welcome to 23percent club, ${account.name.split(" ")[0]}`,
    body: "Start with the financial health check. It shows which lessons will help you most.",
    href: "/know-yourself/health",
    at: now(),
    read: false,
    kind: "system",
  };
  const profile: UserData = { ...guest, notifications: [welcome, ...guest.notifications] };
  const profiles = { ...state.profiles, [email]: profile };
  delete profiles[GUEST];
  commit({ ...state, accounts: { ...state.accounts, [email]: account }, session: email, profiles });
  logActivity("account", "Created your 23percent club account", "/dashboard");
  return { ok: true };
}

export async function logIn(emailRaw: string, password: string): Promise<AuthResult> {
  ensureLoaded();
  const email = normEmail(emailRaw);

  const c = sb();
  if (c) {
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { ok: false, error: friendlyAuthError(error?.message ?? "Invalid login credentials") };
    try {
      await adoptCloudUser(data.user);
    } catch {
      await c.auth.signOut();
      return { ok: false, error: "Logged in, but we couldn't load your saved data. Try again in a moment." };
    }
    return { ok: true };
  }

  const acct = state.accounts[email];
  if (!acct || acct.passHash !== sha256(`${email}:${password}`)) {
    return { ok: false, error: "That email and password don't match an account on this device." };
  }
  commit({ ...state, session: email });
  return { ok: true };
}

export function logOut() {
  ensureLoaded();
  const key = state.session;
  const cloud = key ? !!state.accounts[key]?.cloud : false;
  const finish = () => {
    commit({ ...state, session: null }, { sync: false });
    if (cloud) void sb()?.auth.signOut();
  };
  // Save anything pending before the session ends.
  if (cloud && key) void pushNow(key).finally(finish);
  else finish();
}

/** Email a password-reset link (cloud accounts only). */
export async function requestPasswordReset(emailRaw: string): Promise<AuthResult> {
  const c = sb();
  if (!c) return { ok: false, error: "Password reset is only available for synced accounts." };
  const email = normEmail(emailRaw);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  const { error } = await c.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  return { ok: true };
}

/** Set a new password after following a reset link. */
export async function setNewPassword(password: string): Promise<AuthResult> {
  const c = sb();
  if (!c) return { ok: false, error: "Password reset is only available for synced accounts." };
  if (password.length < 8) return { ok: false, error: "Use at least 8 characters for your password." };
  const { error } = await c.auth.updateUser({ password });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  return { ok: true };
}

export { cloudEnabled };

export function updateAccount(patch: Partial<Pick<Account, "name" | "city" | "ageBand">>) {
  ensureLoaded();
  if (!state.session) return;
  const acct = state.accounts[state.session];
  if (!acct) return;
  commit({ ...state, accounts: { ...state.accounts, [state.session]: { ...acct, ...patch } } });
}

export function resetProfile() {
  ensureLoaded();
  const key = profileKey(state);
  commit({ ...state, profiles: { ...state.profiles, [key]: emptyUserData() } });
}

export async function deleteAccount(): Promise<{ ok: true } | { ok: false; error: string }> {
  ensureLoaded();
  if (!state.session) return { ok: true };
  const email = state.session;
  if (state.accounts[email]?.cloud) {
    const c = sb();
    const res = c ? await c.rpc("delete_my_account") : { error: { message: "Cloud is not configured" } };
    if (res.error) return { ok: false, error: "Couldn't delete your account. Check your connection and try again." };
    await c?.auth.signOut();
  }
  const accounts = { ...state.accounts };
  const profiles = { ...state.profiles };
  delete accounts[email];
  delete profiles[email];
  commit({ ...state, accounts, profiles, session: null }, { sync: false });
  return { ok: true };
}

export function exportData(): string {
  ensureLoaded();
  const key = profileKey(state);
  const acct = state.session ? state.accounts[state.session] : null;
  return JSON.stringify(
    { exportedAt: now(), account: acct ? { name: acct.name, email: acct.email, createdAt: acct.createdAt } : null, data: state.profiles[key] ?? emptyUserData() },
    null,
    2,
  );
}

export { badgeCtx };
