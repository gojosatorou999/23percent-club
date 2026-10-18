"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setNewPassword, toast } from "@/lib/store/store";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await setNewPassword(password);
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    toast("Password updated", "You're signed in with your new password.", "pos");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block">
        <span className="t-label">New password</span>
        <input
          className="input mt-1.5"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <span className="mt-1.5 block text-sm text-ink-3">At least 8 characters.</span>
      </label>
      {error && (
        <p role="alert" className="rounded-xl bg-neg-soft px-4 py-3 text-sm text-neg">
          {error} If your link has expired, <Link href="/login" className="font-semibold underline">request a new one</Link>.
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        Save new password
      </button>
    </form>
  );
}
