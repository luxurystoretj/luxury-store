"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      // Force the shell layout's server-side auth check to re-run against
      // the new admin_token cookie before navigation.
      router.refresh();
      router.push("/admin");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Неверный пароль");
      } else {
        setError("Ошибка входа. Попробуйте ещё раз.");
      }
      setIsSubmitting(false);
    }
  }

  const hasError = error !== null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="admin-password"
          className="text-sm text-foreground"
        >
          Пароль
        </label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "admin-password-error" : undefined}
          disabled={isSubmitting}
        />
        {hasError ? (
          <p
            id="admin-password-error"
            role="alert"
            className="text-sm text-[var(--error)]"
          >
            {error}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting || password.length === 0}>
        {isSubmitting ? "Вход…" : "Войти"}
      </Button>
    </form>
  );
}
