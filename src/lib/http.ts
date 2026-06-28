import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown, fallback = "A művelet sikertelen.") {
  console.error(error);
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => issue.message).join(" ");
    return NextResponse.json({ error: details || fallback }, { status: 400 });
  }
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message || fallback }, { status: 400 });
}

export function requireSecret(request: Request, secret?: string) {
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}
