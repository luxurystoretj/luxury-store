import { LoginForm } from "@/features/auth/components/login-form";

// Public login page. Auth is handled by src/middleware.ts: an already-authed
// visitor is redirected to /admin before this renders, and unauthenticated
// visitors are allowed through so the form is reachable.
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground"
          >
            Luxury Store
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-[1.75rem] font-normal leading-tight text-foreground"
          >
            Вход в админ-панель
          </h1>
        </div>

        <div className="border border-border-default bg-background p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
