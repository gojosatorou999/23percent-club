import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" lead="Log in to pick up where you left off.">
      <Suspense fallback={<div className="skeleton h-72" />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
