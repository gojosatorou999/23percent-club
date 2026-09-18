import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata = { title: "Create your account", description: "Join 23% Club free. Track lessons, goals, net worth and your financial health in one dashboard." };

export default function SignupPage() {
  return (
    <AuthShell title="Join 23% Club" lead="Free, and it takes about 20 seconds. Anything you've already done here moves into your account.">
      <Suspense fallback={<div className="skeleton h-80" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  );
}
