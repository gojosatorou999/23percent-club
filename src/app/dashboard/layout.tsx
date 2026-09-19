import type { Metadata } from "next";
import { DashNav, GuestBanner } from "@/components/dashboard/DashNav";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s | Dashboard | 23percent club" }, robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap pb-24 pt-6 sm:pt-10">
      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
        <DashNav />
        <div className="min-w-0">
          <GuestBanner />
          {children}
        </div>
      </div>
    </div>
  );
}
