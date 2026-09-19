import { LegalPage } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy policy",
  description: "How 23percent club handles your data: your figures stay on your device.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" path="/privacy" updated="19 September 2026">
      <h2>The short version</h2>
      <p>
        Your account, learning progress, calculator inputs, goals, net worth, trackers and assessment answers are stored in your own browser,
        on your own device. They are not sent to our servers.
      </p>
      <h2>What is stored, and where</h2>
      <ul>
        <li>
          <strong>Account:</strong> your name, email and a one-way hash of your password, in your browser&apos;s local storage.
        </li>
        <li>
          <strong>Progress and trackers:</strong> lessons completed, quiz scores, badges, saved calculations, goals, net worth, ledger, habits,
          event registrations and assessment results, in the same place.
        </li>
        <li>
          <strong>Preferences:</strong> your light or dark theme choice.
        </li>
      </ul>
      <p>Clearing your browser&apos;s site data removes all of it. Use Dashboard, then Settings, to export a copy first.</p>
      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell or share personal data.</li>
        <li>We do not use advertising trackers or cookies. We may count page visits with Plausible, a cookie-free analytics service that stores no personal data.</li>
        <li>We do not read the numbers you enter into calculators or trackers.</li>
      </ul>
      <h2>Your rights</h2>
      <p>
        Because your data stays on your device, you control it directly: view it in your dashboard, export it from Settings, and delete it with
        Delete account. This is consistent with the rights described in India&apos;s Digital Personal Data Protection Act, 2023.
      </p>
    </LegalPage>
  );
}
