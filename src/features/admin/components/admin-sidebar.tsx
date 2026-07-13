"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/features/auth/api/logout";
import { ADMIN_NAV_ITEMS } from "@/features/admin/lib/nav-items";
import { cn } from "@/lib/utils";

// Desktop-first sidebar (visible md+). Mobile gets a compact top bar via
// AdminMobileBar in the shell layout. The owner primarily edits from desktop —
// session 1 does not build a mobile nav drawer.
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden shrink-0 border-r border-border-default bg-background md:flex md:w-60 md:flex-col"
      aria-label="Навигация админ-панели"
    >
      <div className="border-b border-border-subtle px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
          Luxury Store
        </p>
        <p className="font-[family-name:var(--font-display)] text-xl text-foreground">
          Админ
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-out",
                "hover:bg-muted",
                "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isActive &&
                  "bg-muted text-[var(--accent)] font-medium",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="border-t border-border-subtle px-3 py-4">
        <button
          type="submit"
          className={cn(
            "w-full px-3 py-2 text-left text-sm text-foreground transition-colors duration-150 ease-out",
            "hover:text-[var(--accent)] hover:underline hover:decoration-1 hover:underline-offset-4",
            "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          Выход
        </button>
      </form>
    </aside>
  );
}

// Compact top strip for narrow viewports: wordmark + logout, no nav. Nav on
// mobile is out of scope for session 1 (see AdminSidebar note).
export function AdminMobileBar() {
  return (
    <div className="flex items-center justify-between border-b border-border-default bg-background px-4 py-3 md:hidden">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
        Luxury Store · Админ
      </p>
      <form action={logoutAction}>
        <button
          type="submit"
          className={cn(
            "text-sm text-foreground transition-colors duration-150 ease-out",
            "hover:text-[var(--accent)] hover:underline hover:decoration-1 hover:underline-offset-4",
            "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          Выход
        </button>
      </form>
    </div>
  );
}
