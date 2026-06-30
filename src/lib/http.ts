import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { reportError } from "@/lib/monitoring";

export function apiError(error: unknown, fallback = "A művelet sikertelen.", context: Record<string, unknown> = {}) {
  reportError(error, context);
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
