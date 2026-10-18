import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Set a new password", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a new password" lead="Choose a new password for your account.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
