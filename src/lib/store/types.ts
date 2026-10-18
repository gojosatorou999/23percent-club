export interface Account {
  id: string;
  name: string;
  email: string;
  /** Only for accounts kept on this device. Cloud accounts never store a password here. */
  passHash?: string;
  /** True when the account lives in Supabase. `id` is then the Supabase user id. */
  cloud?: boolean;
  /** Cloud accounts: local changes not yet saved to the server. */
  dirty?: boolean;
  syncedAt?: string;
  createdAt: string;
  city?: string;
  ageBand?: string;
}

export interface SavedTool {
  id: string;
  slug: string;
  label: string;
  query: string;
  headline: string;
  savedAt: string;
}

export type GoalKind = "home" | "education" | "retirement" | "travel" | "emergency" | "wedding" | "car" | "other";

export interface Goal {
  id: string;
  name: string;
  kind: GoalKind;
  target: number;
  saved: number;
  monthly: number;
  targetDate: string;
  expectedReturn: number;
  createdAt: string;
  contributions: { date: string; amount: number }[];
}

export interface NwItem {
  id: string;
  label: string;
  category: string;
  value: number;
}

export interface LedgerEntry {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  invested: number;
}

export interface Holding {
  id: string;
  name: string;
  assetClass: "equity" | "debt" | "gold" | "cash" | "real-estate" | "other";
  invested: number;
  current: number;
}

export interface Habit {
  id: string;
  name: string;
  days: string[]; // YYYY-MM-DD
  createdAt: string;
}

export interface PersonalityResult {
  archetype: string;
  scores: Record<string, number>; // dimension -> 0..100
  takenAt: string;
}

export interface HealthResult {
  score: number;
  areas: Record<string, number>; // area -> 0..100
  answers: Record<string, number>;
  takenAt: string;
  history: { date: string; score: number }[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  href?: string;
  at: string;
  read: boolean;
  kind: "badge" | "event" | "learning" | "system" | "goal";
}

export interface Activity {
  id: string;
  kind: "lesson" | "quiz" | "tool" | "badge" | "event" | "diagnostic" | "goal" | "tracker" | "junior" | "account";
  label: string;
  href?: string;
  at: string;
}

export interface QuizRecord {
  best: number;
  last: number;
  total: number;
  attempts: number;
  at: string;
}

export interface UserData {
  lessons: Record<string, string>;
  quizzes: Record<string, QuizRecord>;
  badges: Record<string, string>;
  savedTools: SavedTool[];
  goals: Goal[];
  assets: NwItem[];
  liabilities: NwItem[];
  nwSnapshots: { date: string; value: number }[];
  ledger: LedgerEntry[];
  holdings: Holding[];
  habits: Habit[];
  events: Record<string, string>;
  personality?: PersonalityResult;
  health?: HealthResult;
  junior: { stars: number; done: Record<string, string> };
  notifications: AppNotification[];
  activity: Activity[];
  savedArticles: Record<string, string>;
}

export interface AppState {
  v: 1;
  accounts: Record<string, Account>;
  session: string | null;
  profiles: Record<string, UserData>;
}

export const GUEST = "guest";

export function emptyUserData(): UserData {
  return {
    lessons: {},
    quizzes: {},
    badges: {},
    savedTools: [],
    goals: [],
    assets: [],
    liabilities: [],
    nwSnapshots: [],
    ledger: [],
    holdings: [],
    habits: [],
    events: {},
    junior: { stars: 0, done: {} },
    notifications: [],
    activity: [],
    savedArticles: {},
  };
}
