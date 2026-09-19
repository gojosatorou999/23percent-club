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

/*
 * The 23percent club client store.
 *
 * Accounts, progress and trackers live on this device (localStorage), under
 * one versioned key. Every write goes through `commit`, which persists,
 * re-evaluates badges and notifies subscribers. Swapping localStorage for a
 * server is a matter of replacing `persist`/`read` — the rest of the app
 * talks only to the actions below.
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

function commit(next: AppState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
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

export function signUp(input: { name: string; email: string; password: string }): { ok: true } | { ok: false; error: string } {
  ensureLoaded();
  const email = normEmail(input.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (input.name.trim().length < 2) return { ok: false, error: "Enter your name." };
  if (input.password.length < 8) return { ok: false, error: "Use at least 8 characters for your password." };
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

export function logIn(emailRaw: string, password: string): { ok: true } | { ok: false; error: string } {
  ensureLoaded();
  const email = normEmail(emailRaw);
  const acct = state.accounts[email];
  if (!acct || acct.passHash !== sha256(`${email}:${password}`)) {
    return { ok: false, error: "That email and password don't match an account on this device." };
  }
  commit({ ...state, session: email });
  return { ok: true };
}

export function logOut() {
  ensureLoaded();
  commit({ ...state, session: null });
}

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

export function deleteAccount() {
  ensureLoaded();
  if (!state.session) return;
  const email = state.session;
  const accounts = { ...state.accounts };
  const profiles = { ...state.profiles };
  delete accounts[email];
  delete profiles[email];
  commit({ ...state, accounts, profiles, session: null });
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
