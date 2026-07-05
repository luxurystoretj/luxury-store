import type { ApiEnvelope } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getBaseUrl(): string {
  // Client-side: relative path, the browser resolves it against the current origin.
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, init);
  const body: ApiEnvelope<T> = await res.json();
  if (!body.success) throw new ApiError(body.message, res.status);
  return body.data;
}
