"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { award } from "./JuniorKit";
import { inr, inrWords } from "@/lib/format";
import { sip } from "@/lib/calc/invest";
import { AreaChart } from "@/components/charts/AreaChart";
import { cn } from "@/lib/cn";

function Done({ title, body, onAgain }: { title: string; body: string; onAgain: () => void }) {
  return (
    <div className="anim-pop rounded-[28px] border-2 border-gold-300 bg-surface p-6 text-center sm:p-10">
      <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-lg text-ink-2">{body}</p>
      <button type="button" onClick={onAgain} className="btn btn-ghost mt-6">
        <RotateCcw className="h-4 w-4" /> Play again
      </button>
    </div>
  );
}

/* ——— Needs or wants ——— */

const NW: { item: string; need: boolean; why: string }[] = [
  { item: "School shoes that fit", need: true, why: "You need shoes to go to school safely." },
  { item: "A third pair of sunglasses", need: false, why: "Nice to have, but you already have two." },
  { item: "Vegetables for dinner", need: true, why: "Food keeps you healthy." },
  { item: "A new video game", need: false, why: "Fun, but you can live without it." },
  { item: "A water bottle for school", need: true, why: "You need to drink water during the day." },
  { item: "Sparkly stickers", need: false, why: "They're fun, not necessary." },
  { item: "Medicine when you're ill", need: true, why: "Health comes first." },
  { item: "A bigger TV", need: false, why: "The old one still works." },
  { item: "Notebooks for class", need: true, why: "You need them to learn." },
  { item: "An ice cream every day", need: false, why: "A treat, not a need." },
  { item: "A warm blanket in winter", need: true, why: "It keeps you warm and well." },
  { item: "Designer school bag", need: false, why: "Any sturdy bag does the same job." },
];

export function NeedsWants() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [last, setLast] = useState<{ ok: boolean; why: string } | null>(null);
  const it = NW[i];
  const answer = (need: boolean) => {
    if (!it) return;
    const ok = need === it.need;
    setScore((s) => s + (ok ? 1 : 0));
    setLast({ ok, why: it.why });
    const nextI = i + 1;
    window.setTimeout(() => {
      setLast(null);
      setI(nextI);
      if (nextI === NW.length) award("game-needs-wants", 3, "Played Needs or wants");
    }, 1100);
  };
  if (!it)
    return (
      <Done
        title={`${score} of ${NW.length} right!`}
        body="Needs keep us safe and healthy. Wants make life fun. Smart savers pay for needs first, then choose their wants."
        onAgain={() => {
          setI(0);
          setScore(0);
        }}
      />
    );
  return (
    <div className="rounded-[28px] border border-line bg-surface p-6 text-center sm:p-10">
      <p className="text-sm font-semibold text-ink-3 tnum">
        {i + 1} / {NW.length} · Score {score}
      </p>
      <div key={i} className="anim-pop g-sea mx-auto mt-6 grid min-h-[180px] max-w-md place-items-center rounded-[28px] p-6 text-white">
        <p className="font-display text-3xl font-bold leading-tight">{it.item}</p>
      </div>
      <div className="h-14 pt-3" aria-live="polite">
        {last && (
          <p className={cn("anim-pop font-semibold", last.ok ? "text-pos" : "text-neg")}>
            {last.ok ? "Right! " : "Hmm. "}
            {last.why}
          </p>
        )}
      </div>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <button type="button" disabled={!!last} onClick={() => answer(true)} className="min-h-[64px] rounded-2xl bg-tk-600 text-xl font-bold text-white transition-transform active:scale-95">
          Need
        </button>
        <button type="button" disabled={!!last} onClick={() => answer(false)} className="min-h-[64px] rounded-2xl bg-murex-500 text-xl font-bold text-white transition-transform active:scale-95">
          Want
        </button>
      </div>
    </div>
  );
}

/* ——— Piggy bank ——— */

export function PiggyBank() {
  const GOAL = 600;
  const POCKET = 50;
  const [week, setWeek] = useState(1);
  const [saved, setSaved] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const done = saved >= GOAL;

  const choose = (save: number) => {
    let s = saved + save;
    const msgs = [`Week ${week}: saved ${inr(save)}, spent ${inr(POCKET - save)}`];
    let b = bonus;
    if (week % 4 === 0) {
      const extra = Math.round(s * 0.1);
      s += extra;
      b += extra;
      msgs.push(`Family bank bonus: +${inr(extra)} (10% of your savings)`);
    }
    setSaved(s);
    setBonus(b);
    setLog((l) => [...msgs.reverse(), ...l].slice(0, 8));
    setWeek(week + 1);
    if (s >= GOAL) award("game-piggy-bank", 3, "Reached the piggy bank goal");
  };

  const reset = () => {
    setWeek(1);
    setSaved(0);
    setBonus(0);
    setLog([]);
  };

  if (done)
    return <Done title={`Cricket bat bought in ${week - 1} weeks!`} body={`You saved ${inr(saved)}, and ${inr(bonus)} of it came from the family bank's bonus. That's what saving plus interest does.`} onAgain={reset} />;

  return (
    <div className="grid gap-6 rounded-[28px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-ink-3">Goal: a cricket bat for {inr(GOAL)}</p>
        <div className="relative mx-auto mt-4 h-56 w-44 overflow-hidden rounded-[40%_40%_36%_36%] border-4 border-gold-400 bg-surface-2">
          <div className="absolute inset-x-0 bottom-0 transition-[height] duration-700" style={{ height: `${Math.min(100, (saved / GOAL) * 100)}%`, background: "linear-gradient(0deg,#bf8a2a,#ecc97c)" }} />
          <p className="absolute inset-0 grid place-items-center font-display text-3xl font-bold tnum">{inr(saved)}</p>
        </div>
        <p className="mt-3 text-center text-sm text-ink-3">Every 4 weeks, the family bank adds 10% of what you&apos;ve saved.</p>
      </div>
      <div>
        <p className="font-display text-2xl font-bold">Week {week}</p>
        <p className="mt-1 text-ink-2">You get {inr(POCKET)} pocket money. How much will you save?</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[10, 30, 50].map((s) => (
            <button key={s} type="button" onClick={() => choose(s)} className="min-h-[72px] rounded-2xl border-2 border-line-strong p-2 font-semibold transition-colors hover:border-accent hover:bg-accent-soft">
              Save {inr(s)}
              <span className="block text-xs font-normal text-ink-3">spend {inr(POCKET - s)}</span>
            </button>
          ))}
        </div>
        <ul className="mt-5 space-y-1 text-sm text-ink-2" aria-live="polite">
          {log.map((l, k) => (
            <li key={k} className={l.startsWith("Family") ? "font-semibold text-gold-600" : ""}>
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ——— Budget challenge ——— */

export function BudgetChallenge() {
  const MONEY = 3000;
  const GOAL = 5000;
  const MONTHS = 4;
  const [alloc, setAlloc] = useState({ food: 900, fun: 800, phone: 300, save: 1000 });
  const total = alloc.food + alloc.fun + alloc.phone + alloc.save;
  const over = total - MONEY;
  const willSave = alloc.save * MONTHS;
  const ok = over <= 0 && willSave >= GOAL && alloc.food >= 600 && alloc.phone >= 250;
  const cats: { k: keyof typeof alloc; label: string; min: number; hint: string }[] = [
    { k: "food", label: "Snacks and canteen", min: 600, hint: "At least ₹600: you need to eat" },
    { k: "phone", label: "Phone recharge", min: 250, hint: "At least ₹250 for your plan" },
    { k: "fun", label: "Movies, games, outings", min: 0, hint: "Up to you" },
    { k: "save", label: "Savings", min: 0, hint: `Goal: ${inr(GOAL)} headphones in ${MONTHS} months` },
  ];
  const [claimed, setClaimed] = useState(false);
  return (
    <div className="grid gap-6 rounded-[28px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-5">
        <p className="text-ink-2">
          You get <b className="text-ink">{inr(MONEY)}</b> a month. Split it so you can buy {inr(GOAL)} headphones in {MONTHS} months.
        </p>
        {cats.map((c) => (
          <label key={c.k} className="block">
            <span className="flex justify-between text-sm">
              <span className="font-medium">{c.label}</span>
              <span className="font-semibold tnum">{inr(alloc[c.k])}</span>
            </span>
            <input
              type="range"
              className="range mt-1"
              min={0}
              max={2000}
              step={50}
              value={alloc[c.k]}
              onChange={(e) => setAlloc((a) => ({ ...a, [c.k]: +e.target.value }))}
              style={{ ["--fill" as string]: `${(alloc[c.k] / 2000) * 100}%` }}
              aria-label={c.label}
            />
            <span className={cn("text-xs", alloc[c.k] < c.min ? "text-neg" : "text-ink-3")}>{c.hint}</span>
          </label>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className={cn("rounded-2xl p-5", over > 0 ? "bg-neg-soft" : "bg-surface-2")}>
          <p className="text-sm text-ink-3">Allocated</p>
          <p className="font-display text-3xl font-bold tnum">
            {inr(total)} <span className="text-base font-medium text-ink-3">of {inr(MONEY)}</span>
          </p>
          {over > 0 && <p className="mt-1 font-semibold text-neg">{inr(over)} over budget</p>}
        </div>
        <div className="rounded-2xl bg-surface-2 p-5">
          <p className="text-sm text-ink-3">Saved after {MONTHS} months</p>
          <p className="font-display text-3xl font-bold tnum">{inr(willSave)}</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full g-aurora transition-[width] duration-500" style={{ width: `${Math.min(100, (willSave / GOAL) * 100)}%` }} />
          </div>
        </div>
        {ok ? (
          <div className="anim-pop rounded-2xl bg-pos-soft p-5">
            <p className="font-semibold text-pos">You did it: headphones in {MONTHS} months, and everything paid for.</p>
            {!claimed && (
              <button
                type="button"
                className="btn btn-primary btn-sm mt-3"
                onClick={() => {
                  award("game-budget-challenge", 3, "Balanced the ₹3,000 month");
                  setClaimed(true);
                }}
              >
                Claim your stars
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-3">Tip: savings of {inr(Math.ceil(GOAL / MONTHS / 50) * 50)} a month reach the goal. What will you trim?</p>
        )}
      </div>
    </div>
  );
}

/* ——— Compounding race ——— */

export function CompoundRace() {
  const [rate, setRate] = useState(10);
  const ria = useMemo(() => {
    // ₹1,000/month from 15 to 25, then left invested until 60
    const early = sip(1000, rate, 10).total;
    return Array.from({ length: 46 }, (_, k) => {
      const age = 15 + k;
      if (age <= 25) return age === 15 ? 0 : sip(1000, rate, age - 15).total;
      return early * Math.pow(1 + rate / 100 / 12, (age - 25) * 12);
    });
  }, [rate]);
  const kabir = useMemo(() => Array.from({ length: 46 }, (_, k) => (15 + k <= 25 ? 0 : sip(1000, rate, 15 + k - 25).total)), [rate]);
  const ages = Array.from({ length: 46 }, (_, k) => 15 + k);
  const rFinal = ria.at(-1)!;
  const kFinal = kabir.at(-1)!;
  return (
    <div className="space-y-5 rounded-[28px] border border-line bg-surface p-6 sm:p-8">
      <p className="text-ink-2">
        <b className="text-ink">Ria</b> invests ₹1,000 a month from 15 to 25, then stops (₹1.2 lakh in total). <b className="text-ink">Kabir</b> invests ₹1,000 a month from 25 to 60 (₹4.2 lakh).
      </p>
      <label className="block max-w-sm">
        <span className="flex justify-between text-sm">
          <span>Yearly return</span>
          <span className="font-semibold tnum">{rate}%</span>
        </span>
        <input type="range" className="range mt-1" min={4} max={14} value={rate} onChange={(e) => setRate(+e.target.value)} style={{ ["--fill" as string]: `${((rate - 4) / 10) * 100}%` }} aria-label="Yearly return" />
      </label>
      <AreaChart
        ariaLabel="Ria versus Kabir by age"
        labels={ages}
        xTitle="Age"
        series={[
          { name: "Ria (starts at 15)", values: ria },
          { name: "Kabir (starts at 25)", values: kabir },
        ]}
        height={240}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-surface-2 p-4">
          <p className="text-sm text-ink-3">Ria at 60</p>
          <p className="font-display text-2xl font-bold tnum">{inrWords(rFinal)}</p>
        </div>
        <div className="rounded-2xl bg-surface-2 p-4">
          <p className="text-sm text-ink-3">Kabir at 60</p>
          <p className="font-display text-2xl font-bold tnum">{inrWords(kFinal)}</p>
        </div>
      </div>
      <p className="font-medium">
        {rFinal > kFinal ? "Ria wins, with less than a third of the money invested. Starting early beats investing more." : "At this low return Kabir catches up. Try a higher return and watch the early start take over."}
      </p>
      <button type="button" className="btn btn-primary" onClick={() => award("game-compound-race", 3, "Ran the compounding race")}>
        I get it: claim stars
      </button>
    </div>
  );
}

/* ——— Scam spotter ——— */

const MSGS: { from: string; text: string; scam: boolean; why: string }[] = [
  { from: "Unknown number", text: "Congratulations! You won ₹25,00,000 in the KBC lucky draw. Pay ₹4,999 processing fee to claim.", scam: true, why: "Real prizes never ask you to pay to receive them." },
  { from: "Your bank (SMS)", text: "₹1,200 debited from A/c XX4521 via UPI. Not you? Call the number on the back of your card.", scam: false, why: "A plain alert that tells you to use the official number is normal." },
  { from: "Instagram DM", text: "Hi! I'm a SEBI-registered trader. Join my VIP group, 300% returns in 30 days guaranteed.", scam: true, why: "Guaranteed high returns and DMs from 'traders' are classic fraud." },
  { from: "Friend's number", text: "Hey, urgent, can you send ₹3,000 to this UPI ID? Phone is broken, will return tonight.", scam: true, why: "Account takeovers look like friends. Call them on another number first." },
  { from: "Unknown caller", text: "Your parcel is held by customs. Share the OTP we just sent to release it.", scam: true, why: "Never share an OTP. Customs and couriers never ask for it." },
  { from: "School app", text: "Reminder: term fee due on 15th. Pay through the school's official app or office.", scam: false, why: "Points you to the official channel and asks for nothing sensitive." },
  { from: "Buyer on OLX", text: "I'll pay for your cycle! Just scan this QR code to RECEIVE ₹5,000.", scam: true, why: "You never scan a QR or enter a PIN to receive money. Only to pay." },
  { from: "Mutual fund house (email)", text: "Your monthly account statement is attached. Login only via our website.", scam: false, why: "Statements are routine. Check the sender's domain, and don't click unknown links." },
];

export function ScamSpotter() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [last, setLast] = useState<{ ok: boolean; why: string } | null>(null);
  const m = MSGS[i];
  const answer = (scam: boolean) => {
    if (!m) return;
    const ok = scam === m.scam;
    setScore((s) => s + (ok ? 1 : 0));
    setLast({ ok, why: m.why });
  };
  const next = () => {
    setLast(null);
    const n = i + 1;
    setI(n);
    if (n === MSGS.length) award("game-scam-spotter", 3, "Completed Scam spotter");
  };
  if (!m)
    return (
      <Done
        title={`${score} of ${MSGS.length} spotted`}
        body="Never share an OTP or UPI PIN, never pay to receive money, and treat guaranteed returns as a warning. If you're scammed, call 1930 or report at cybercrime.gov.in."
        onAgain={() => {
          setI(0);
          setScore(0);
        }}
      />
    );
  return (
    <div className="rounded-[28px] border border-line bg-surface p-5 sm:p-8">
      <p className="text-sm font-semibold text-ink-3 tnum">
        Message {i + 1} of {MSGS.length} · Score {score}
      </p>
      <div key={i} className="anim-pop mt-4 max-w-lg rounded-[22px] rounded-tl-md bg-surface-2 p-5">
        <p className="text-xs font-semibold text-ink-3">{m.from}</p>
        <p className="mt-1.5 text-[1.05rem]">{m.text}</p>
      </div>
      {!last ? (
        <div className="mt-5 grid max-w-lg grid-cols-2 gap-3">
          <button type="button" onClick={() => answer(false)} className="flex min-h-[60px] items-center justify-center gap-2 rounded-2xl bg-pos text-lg font-bold text-white active:scale-95">
            <ShieldCheck className="h-5 w-5" /> Safe
          </button>
          <button type="button" onClick={() => answer(true)} className="flex min-h-[60px] items-center justify-center gap-2 rounded-2xl bg-neg text-lg font-bold text-white active:scale-95">
            <ShieldAlert className="h-5 w-5" /> Scam
          </button>
        </div>
      ) : (
        <div className="anim-pop mt-5 max-w-lg rounded-2xl border border-line p-4">
          <p className={cn("flex items-center gap-2 font-semibold", last.ok ? "text-pos" : "text-neg")}>
            {last.ok ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            {last.ok ? "Correct" : "Careful"}: this one is {m.scam ? "a scam" : "safe"}.
          </p>
          <p className="mt-1 text-ink-2">{last.why}</p>
          <button type="button" onClick={next} className="btn btn-primary btn-sm mt-3">
            Next message
          </button>
        </div>
      )}
    </div>
  );
}

export const GAME_COMPONENTS: Record<string, () => React.ReactElement> = {
  "needs-wants": NeedsWants,
  "piggy-bank": PiggyBank,
  "budget-challenge": BudgetChallenge,
  "compound-race": CompoundRace,
  "scam-spotter": ScamSpotter,
};
