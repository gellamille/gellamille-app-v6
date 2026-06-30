type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function safeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    };
  }
  return { message: String(error) };
}

function writeLog(level: LogLevel, message: string, context: LogContext = {}) {
  const payload = {
    level,
    message,
    service: "gellamille-app",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "local",
    timestamp: new Date().toISOString(),
    ...context
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function logInfo(message: string, context?: LogContext) {
  writeLog("info", message, context);
}

export function logWarning(message: string, context?: LogContext) {
  writeLog("warn", message, context);
}

export function reportError(error: unknown, context: LogContext = {}) {
  const payload = { ...context, error: safeError(error) };
  writeLog("error", "application.error", payload);

  const webhook = process.env.ERROR_WEBHOOK_URL;
  if (webhook) {
    void fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: "gellamille-app",
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "local",
        timestamp: new Date().toISOString(),
        ...payload
      })
    }).catch(() => undefined);
  }
}

export function monitoringStatus() {
  return {
    structuredLogs: true,
    errorWebhookConfigured: Boolean(process.env.ERROR_WEBHOOK_URL),
    vercelEnvironment: process.env.VERCEL_ENV ?? null
  };
}
