"use client";

import { Bookmark, BookmarkCheck, RotateCcw, Share2 } from "lucide-react";
import { logActivity, toast, uid, update, useProfile } from "@/lib/store/store";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** Save to dashboard, share a link, reset — the same three actions on every tool. */
export function ToolActions({ slug, name, query, headline, onReset }: { slug: string; name: string; query: string; headline: string; onReset: () => void }) {
  const profile = useProfile();
  const saved = profile.savedTools.some((t) => t.slug === slug && t.query === query);

  const save = () => {
    if (saved) {
      update((d) => ({ savedTools: d.savedTools.filter((t) => !(t.slug === slug && t.query === query)) }));
      toast("Removed from saved tools");
      return;
    }
    update((d) => ({
      savedTools: [{ id: uid(), slug, label: name, query, headline, savedAt: new Date().toISOString() }, ...d.savedTools].slice(0, 50),
    }));
    logActivity("tool", `Saved a ${name.replace(/ calculator$/i, "")} calculation: ${headline}`, `/tools/${slug}?${query}`);
    toast("Saved to your dashboard", "Find it under Saved tools, ready to reopen.", "pos");
  };

  const share = async () => {
    const url = `${window.location.origin}/tools/${slug}?${query}`;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: `${name} | 23percent club`, text: headline, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    if (await copy(url)) toast("Link copied", "Anyone with the link sees these exact inputs.");
  };

  const btn = "inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-white/15 px-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/25";
  return (
    <>
      <button type="button" onClick={save} className={btn} aria-pressed={saved}>
        {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
        {saved ? "Saved" : "Save"}
      </button>
      <button type="button" onClick={share} className={btn}>
        <Share2 className="h-4 w-4" aria-hidden />
        Share
      </button>
      <button type="button" onClick={onReset} className={btn}>
        <RotateCcw className="h-4 w-4" aria-hidden />
        Reset
      </button>
    </>
  );
}
