import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { emptyUserData, type UserData } from "./types";

/*
 * Supabase glue. Everything here is optional: with no keys set the site runs
 * exactly as before, with accounts kept in this browser.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const cloudEnabled = () => Boolean(URL && KEY);

let client: SupabaseClient | null = null;
export function sb(): SupabaseClient | null {
  if (!URL || !KEY || typeof window === "undefined") return null;
  client ??= createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}

export interface MemberRow {
  name: string;
  city: string | null;
  age_band: string | null;
  data: Partial<UserData>;
  created_at: string;
  updated_at: string;
}

export async function pullMember(id: string): Promise<MemberRow | null> {
  const c = sb();
  if (!c) return null;
  const { data, error } = await c.from("members").select("name, city, age_band, data, created_at, updated_at").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as MemberRow | null) ?? null;
}

export async function pushMember(id: string, row: { name: string; city?: string; ageBand?: string; data: UserData }): Promise<string> {
  const c = sb();
  if (!c) throw new Error("Cloud is not configured");
  const updated_at = new Date().toISOString();
  const { error } = await c.from("members").upsert({
    id,
    name: row.name,
    city: row.city ?? null,
    age_band: row.ageBand ?? null,
    data: row.data,
    updated_at,
  });
  if (error) throw error;
  return updated_at;
}

/* ——— Merging two copies of a profile (used when a device has unsynced changes) ——— */

function byId<T extends { id: string }>(a: T[], b: T[]): T[] {
  const seen = new Set(a.map((x) => x.id));
  return [...a, ...b.filter((x) => !seen.has(x.id))];
}

function newest<T extends { takenAt: string }>(a?: T, b?: T): T | undefined {
  if (!a) return b;
  if (!b) return a;
  return a.takenAt >= b.takenAt ? a : b;
}

/** Union of two profiles. `a` wins when both have the same item. */
export function mergeUserData(aIn: Partial<UserData>, bIn: Partial<UserData>): UserData {
  const e = emptyUserData();
  const a = { ...e, ...aIn };
  const b = { ...e, ...bIn };

  const quizzes = { ...b.quizzes };
  for (const [k, q] of Object.entries(a.quizzes)) {
    const other = quizzes[k];
    quizzes[k] = !other || q.attempts >= other.attempts ? q : other;
  }

  const habitIds = new Map(b.habits.map((h) => [h.id, h]));
  const habits = a.habits.map((h) => {
    const o = habitIds.get(h.id);
    return o ? { ...h, days: [...new Set([...h.days, ...o.days])].sort() } : h;
  });
  for (const h of b.habits) if (!a.habits.some((x) => x.id === h.id)) habits.push(h);

  const snaps = new Map<string, number>();
  for (const s of [...b.nwSnapshots, ...a.nwSnapshots]) snaps.set(s.date, s.value);
  const ledger = new Map(b.ledger.map((l) => [l.month, l]));
  for (const l of a.ledger) ledger.set(l.month, l);

  return {
    lessons: { ...b.lessons, ...a.lessons },
    quizzes,
    badges: { ...b.badges, ...a.badges },
    savedTools: byId(a.savedTools, b.savedTools),
    goals: byId(a.goals, b.goals),
    assets: byId(a.assets, b.assets),
    liabilities: byId(a.liabilities, b.liabilities),
    nwSnapshots: [...snaps].map(([date, value]) => ({ date, value })).sort((x, y) => x.date.localeCompare(y.date)),
    ledger: [...ledger.values()].sort((x, y) => x.month.localeCompare(y.month)),
    holdings: byId(a.holdings, b.holdings),
    habits,
    events: { ...b.events, ...a.events },
    personality: newest(a.personality, b.personality),
    health: newest(a.health, b.health),
    junior: { stars: Math.max(a.junior.stars, b.junior.stars), done: { ...b.junior.done, ...a.junior.done } },
    notifications: byId(a.notifications, b.notifications)
      .sort((x, y) => y.at.localeCompare(x.at))
      .slice(0, 60),
    activity: byId(a.activity, b.activity)
      .sort((x, y) => y.at.localeCompare(x.at))
      .slice(0, 200),
    savedArticles: { ...b.savedArticles, ...a.savedArticles },
  };
}

/** Turn Supabase's error messages into something a visitor can act on. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "That email and password don't match. Check them and try again.";
  if (m.includes("not confirmed")) return "Confirm your email first. We sent you a link when you signed up.";
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Log in instead.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Wait a minute and try again.";
  if (m.includes("password") && m.includes("least")) return "Use at least 8 characters for your password.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Couldn't reach the server. Check your connection and try again.";
  return message;
}
