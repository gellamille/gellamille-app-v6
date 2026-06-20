import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "A művelet sikertelen.") {
  console.error(error);
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message || fallback }, { status: 400 });
}

export function requireSecret(request: Request, secret?: string) {
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}
