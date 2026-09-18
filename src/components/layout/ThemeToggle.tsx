"use client";

import { Moon, Sun } from "lucide-react";

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('23club:theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}document.documentElement.classList.add('js');})();`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const flip = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("23club:theme", next);
    } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#070a24" : "#f6f7fd");
  };
  return (
    <button type="button" onClick={flip} className={`btn btn-quiet btn-icon ${className}`} aria-label="Switch between light and dark theme">
      <Sun className="h-[18px] w-[18px] dark:hidden" aria-hidden />
      <Moon className="hidden h-[18px] w-[18px] dark:block" aria-hidden />
    </button>
  );
}
