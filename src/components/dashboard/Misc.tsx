"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Award, Download, Lock, Star, Trash2 } from "lucide-react";
import { deleteAccount, exportData, resetProfile, toast, update, updateAccount, useAccount, useHydrated, useProfile } from "@/lib/store/store";
import { BADGES } from "@/lib/store/badges";
import { MODULES } from "@/content/school-outline";
import { isModuleComplete } from "@/lib/store/badges";
import { badgeCtx } from "@/lib/store/store";
import { getTool } from "@/content/tools-meta";
import { Card } from "./Overview";
import { dateShort, relativeTime } from "@/lib/format";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/cn";

function Skeleton() {
  return <div className="skeleton h-96" />;
}

export function SavedDash({ articles }: { articles: { slug: string; title: string }[] }) {
  const hydrated = useHydrated();
  const d = useProfile();
  if (!hydrated) return <Skeleton />;
  const saved = articles.filter((a) => d.savedArticles[a.slug]);
  return (
    <div className="space-y-5">
      <h1 className="font-display text-[2rem] font-bold tracking-tight">Saved</h1>
      <Card title={`Saved calculations (${d.savedTools.length})`}>
        {d.savedTools.length === 0 ? (
          <p className="text-ink-3">
            Press <b>Save</b> on any calculator result and it appears here, ready to reopen with the same inputs. <Link href="/tools" className="font-semibold text-accent">Browse tools</Link>
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {d.savedTools.map((t) => {
              const meta = getTool(t.slug);
              return (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                  <span className={cn(meta?.gradient ?? "g-tekhelet", "grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-lg font-bold text-white")}>{meta?.glyph}</span>
                  <Link href={`/tools/${t.slug}?${t.query}`} className="min-w-0 flex-1">
                    <span className="block truncate font-semibold hover:text-accent">{t.label}</span>
                    <span className="block truncate text-sm text-ink-3">{t.headline}</span>
                    <span className="text-xs text-ink-3">{relativeTime(t.savedAt)}</span>
                  </Link>
                  <button type="button" className="btn btn-quiet btn-icon" aria-label={`Remove ${t.label}`} onClick={() => update((x) => ({ savedTools: x.savedTools.filter((q) => q.id !== t.id) }))}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <Card title={`Saved articles (${saved.length})`}>
        {saved.length === 0 ? (
          <p className="text-ink-3">
            Save articles from <Link href="/insights" className="font-semibold text-accent">Insights</Link> to read later.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {saved.map((a) => (
              <li key={a.slug} className="flex items-center justify-between gap-3 py-2.5">
                <Link href={`/insights/${a.slug}`} className="font-medium hover:text-accent">
                  {a.title}
                </Link>
                <button
                  type="button"
                  className="btn btn-quiet btn-icon"
                  aria-label={`Remove ${a.title}`}
                  onClick={() =>
                    update((x) => {
                      const s = { ...x.savedArticles };
                      delete s[a.slug];
                      return { savedArticles: s };
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function AchievementsDash() {
  const hydrated = useHydrated();
  const d = useProfile();
  if (!hydrated) return <Skeleton />;
  const certs = MODULES.filter((m) => isModuleComplete(d, badgeCtx, m.slug));
  return (
    <div className="space-y-5">
      <h1 className="font-display text-[2rem] font-bold tracking-tight">Achievements</h1>
      <Card title={`Badges (${Object.keys(d.badges).length} of ${BADGES.length})`}>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BADGES.map((b) => {
            const at = d.badges[b.id];
            return (
              <li key={b.id} className={cn("flex items-center gap-3 rounded-2xl border p-3", at ? "border-line" : "border-dashed border-line-strong opacity-70")}>
                <span
                  className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full font-display font-bold", at ? "text-white" : "bg-surface-2 text-ink-3")}
                  style={at ? { background: b.tier === "gold" ? "linear-gradient(135deg,#bf8a2a,#ecc97c)" : b.tier === "silver" ? "linear-gradient(135deg,#4457cf,#9aa7ef)" : "linear-gradient(135deg,#1784b0,#7fd3f0)" } : undefined}
                >
                  {at ? b.glyph : <Lock className="h-4 w-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{b.name}</span>
                  <span className="block text-sm text-ink-3">{b.description}</span>
                  {at && <span className="text-xs text-ink-3">Earned {dateShort(at)}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Certificates">
          {certs.length === 0 ? (
            <p className="text-ink-3">None yet. Finish a module and pass its quiz.</p>
          ) : (
            <ul className="space-y-2">
              {certs.map((m) => (
                <li key={m.slug}>
                  <Link href={`/learn/${m.slug}/certificate`} className="flex items-center gap-3 rounded-2xl border-2 border-gold-300 p-3 hover:bg-surface-2">
                    <Award className="h-5 w-5 text-gold-500" />
                    <span className="font-semibold">
                      Module {m.n}: {m.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="23percent club Junior">
          <p className="flex items-center gap-2 font-display text-3xl font-bold tnum">
            {d.junior.stars} <Star className="h-7 w-7 fill-gold-400 text-gold-400" />
          </p>
          <p className="mt-1 text-sm text-ink-3">Stars earned in Junior stories, games, quizzes and challenges.</p>
          <Link href="/junior" className="btn btn-ghost btn-sm mt-4">
            Open Junior
          </Link>
        </Card>
      </div>
    </div>
  );
}

export function ActivityDash() {
  const hydrated = useHydrated();
  const d = useProfile();
  if (!hydrated) return <Skeleton />;
  return (
    <div className="space-y-5">
      <h1 className="font-display text-[2rem] font-bold tracking-tight">Activity</h1>
      <Card title={`${d.activity.length} events`}>
        {d.activity.length === 0 ? (
          <p className="text-ink-3">Nothing here yet. Everything you learn, check, save and track is recorded here.</p>
        ) : (
          <ol className="relative space-y-4 border-l border-line pl-5">
            {d.activity.map((a) => (
              <li key={a.id} className="relative">
                <span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-surface" />
                {a.href ? (
                  <Link href={a.href} className="font-medium hover:text-accent">
                    {a.label}
                  </Link>
                ) : (
                  <span className="font-medium">{a.label}</span>
                )}
                <p className="text-sm text-ink-3">
                  {dateShort(a.at)}, {relativeTime(a.at)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}

export function ProfileDash() {
  const hydrated = useHydrated();
  const account = useAccount();
  const [name, setName] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [ageBand, setAgeBand] = useState<string | null>(null);
  if (!hydrated) return <Skeleton />;
  if (!account)
    return (
      <div className="space-y-5">
        <h1 className="font-display text-[2rem] font-bold tracking-tight">Profile</h1>
        <Card title="No account yet">
          <p className="text-ink-2">Create a free account to add your name to certificates and keep your progress under one profile.</p>
          <Link href="/signup?next=/dashboard/profile" className="btn btn-primary mt-4">
            Create account
          </Link>
        </Card>
      </div>
    );
  return (
    <div className="space-y-5">
      <h1 className="font-display text-[2rem] font-bold tracking-tight">Profile</h1>
      <Card title="Your details">
        <div className="grid max-w-xl gap-4">
          <label className="block">
            <span className="t-label">Name (appears on certificates)</span>
            <input className="input mt-1.5" value={name ?? account.name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <span className="t-label">Email</span>
            <input className="input mt-1.5 opacity-70" value={account.email} disabled />
          </label>
          <label className="block">
            <span className="t-label">City (optional)</span>
            <input className="input mt-1.5" value={city ?? account.city ?? ""} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="block">
            <span className="t-label">Age group (optional)</span>
            <select className="input mt-1.5" value={ageBand ?? account.ageBand ?? ""} onChange={(e) => setAgeBand(e.target.value)}>
              <option value="">Prefer not to say</option>
              {["18–24", "25–34", "35–44", "45–54", "55+"].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn-primary w-fit"
            onClick={() => {
              updateAccount({ name: (name ?? account.name).trim() || account.name, city: city ?? account.city, ageBand: ageBand ?? account.ageBand });
              toast("Profile saved", undefined, "pos");
            }}
          >
            Save profile
          </button>
          <p className="text-sm text-ink-3">Member since {dateShort(account.createdAt)}</p>
        </div>
      </Card>
    </div>
  );
}

export function SettingsDash() {
  const hydrated = useHydrated();
  const account = useAccount();
  const router = useRouter();
  if (!hydrated) return <Skeleton />;
  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `23percentclub-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  return (
    <div className="space-y-5">
      <h1 className="font-display text-[2rem] font-bold tracking-tight">Settings</h1>
      <Card title="Appearance">
        <div className="flex items-center justify-between">
          <p className="text-ink-2">Light or dark theme</p>
          <ThemeToggle />
        </div>
      </Card>
      <Card title="Your data">
        <p className="text-ink-2">Everything is stored in this browser. Download a copy any time.</p>
        <button type="button" onClick={download} className="btn btn-ghost mt-4">
          <Download className="h-4 w-4" /> Export my data (JSON)
        </button>
      </Card>
      <Card title="Reset or delete" className="border-neg/30">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ink-2">Clear all progress, goals and trackers{account ? " but keep your account" : ""}.</p>
            <button
              type="button"
              className="btn btn-ghost text-neg"
              onClick={() => {
                if (!window.confirm("Reset all progress, goals and trackers? This can't be undone.")) return;
                resetProfile();
                toast("Progress reset");
              }}
            >
              Reset progress
            </button>
          </div>
          {account && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-ink-2">Delete your account and everything stored for it on this device.</p>
              <button
                type="button"
                className="btn bg-neg text-white"
                onClick={() => {
                  if (!window.confirm("Delete your account and all its data from this device? This can't be undone.")) return;
                  deleteAccount();
                  toast("Account deleted");
                  router.push("/");
                }}
              >
                Delete account
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
