import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PendingAppointmentsAlert } from "@/components/appointments/admin/pending-appointments-alert";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-4 w-32" />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Suspense fallback={<HeaderSkeleton />}>
          <SiteHeader />
        </Suspense>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="px-4 lg:px-6 pt-4">
              <PendingAppointmentsAlert />
            </div>
            <div className="px-4 lg:px-6 pt-4 pb-8">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
