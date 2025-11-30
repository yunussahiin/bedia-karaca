import {
  DashboardStats,
  DashboardActivityChart,
  DashboardRecentActivity,
  DashboardChartsSection,
} from "@/components/dashboard";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DashboardStats />
      <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-2">
        <DashboardActivityChart />
        <DashboardRecentActivity />
      </div>
      <DashboardChartsSection />
    </div>
  );
}
