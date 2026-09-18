"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { logIn, signUp, toast } from "@/lib/store/store";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = mode === "signup" ? signUp({ name, email, password }) : logIn(email, password);
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    toast(mode === "signup" ? "Account created" : "Welcome back", mode === "signup" ? "Your progress now saves to your account." : undefined, "pos");
    router.push(next.startsWith("/") ? next : "/dashboard");
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {mode === "signup" && (
        <label className="block">
          <span className="t-label">Your name</span>
          <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
      )}
      <label className="block">
        <span className="t-label">Email</span>
        <input
          className="input mt-1.5"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <div>
        <label htmlFor="auth-password" className="t-label">
          Password
        </label>
        <span className="relative mt-1.5 block">
          <input
            id="auth-password"
            aria-describedby={mode === "signup" ? "auth-password-hint" : undefined}
            className="input pr-12"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-ink-3"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </span>
        {mode === "signup" && (
          <span id="auth-password-hint" className="mt-1.5 block text-sm text-ink-3">
            At least 8 characters.
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-neg-soft px-4 py-3 text-sm text-neg">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {mode === "signup" ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-sm text-ink-3">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-accent">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to 23% Club?{" "}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-accent">
              Create a free account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
