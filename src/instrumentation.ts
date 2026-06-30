export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logInfo } = await import("@/lib/monitoring");
    logInfo("monitoring.registered", {
      errorWebhookConfigured: Boolean(process.env.ERROR_WEBHOOK_URL)
    });
  }
}
