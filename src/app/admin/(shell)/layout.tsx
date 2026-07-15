import { AdminMobileBar, AdminSidebar } from "@/features/admin/components/admin-sidebar";

// Shell layout for authenticated /admin pages. Auth is enforced by
// src/middleware.ts, which redirects unauthenticated requests to /admin/login
// before this renders. The route group `(shell)` scopes the chrome to admin
// content — /admin/login stays outside so it renders without the sidebar.
export default function AdminShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <AdminMobileBar />
        <main className="flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
