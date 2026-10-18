import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cloudEnabled } from "@/lib/store/cloud";

export function AuthShell({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <section className="wrap grid min-h-[calc(100dvh-var(--nav-h))] items-center gap-12 py-10 lg:grid-cols-[1fr_1fr] lg:py-16">
      <div className="deep grain relative hidden overflow-hidden rounded-[36px] p-10 lg:flex lg:min-h-[560px] lg:flex-col lg:justify-between">
        <p className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight">
          Learn how money works. Build the right systems. Compound for the long term.
        </p>
        <ul className="space-y-3 text-ink-2">
          {[
            "Your lessons, quiz scores and certificates in one place",
            "Saved calculations you can reopen with one tap",
            "Goals, net worth and habits that track your progress",
            "Your health score and investor personality over time",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10">
                <Check className="h-3.5 w-3.5" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="t-display text-[2.4rem] sm:text-[2.9rem]">{title}</h1>
        <p className="t-lead mt-3">{lead}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-8 rounded-2xl border border-line bg-surface p-4 text-sm text-ink-3">
          {cloudEnabled()
            ? "Your progress is saved to your account so it follows you across devices. We only use it to run your dashboard. Export or delete it any time from Settings."
            : "Your account and everything in it are stored in this browser, on this device. We never see your figures. Export or delete them any time from Settings."}
        </p>
      </div>
    </section>
  );
}
