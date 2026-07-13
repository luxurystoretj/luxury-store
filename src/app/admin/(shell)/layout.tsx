import { redirect } from "next/navigation";

import { AdminMobileBar, AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { isAdminAuthenticated } from "@/lib/auth/admin-auth";

// Shell layout for authenticated /admin pages. Route group `(shell)` scopes
// the auth check and chrome to admin content — /admin/login stays outside so
// it can render without the sidebar and without triggering the redirect loop.
export default async function AdminShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

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
