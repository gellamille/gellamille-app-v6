import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function source(path) {
  return readFileSync(join(root, path), "utf8");
}

function assertContains(file, expected, message = expected) {
  const content = source(file);
  assert.ok(content.includes(expected), `${file}: ${message}`);
}

function assertMatches(file, pattern, message = String(pattern)) {
  const content = source(file);
  assert.match(content, pattern, `${file}: ${message}`);
}

describe("kritikus API jogosultsagi es folyamat invariantok", () => {
  it("partner order submit uses own organization partner and own partner_id for partner role", () => {
    const file = "src/app/api/orders/route.ts";
    assertContains(file, 'apiUser(["admin", "management", "sales", "partner"])');
    assertContains(file, 'const partnerId = user.role === "partner" ? user.partner_id : input.partnerId');
    assertContains(file, "where id=$1 and organization_id=$2 and archived_at is null");
  });

  it("partner order list is filtered to the partner's own orders", () => {
    const file = "src/app/api/orders/route.ts";
    assertContains(file, 'if (user.role === "partner")');
    assertContains(file, "partnerFilter = ` and o.partner_id=$2`");
    assertContains(file, "where o.organization_id=$1 and o.archived_at is null");
  });

  it("order approval and reservation are scoped to organization and partner", () => {
    const file = "src/app/api/orders/[id]/actions/route.ts";
    assertContains(file, "where id=$1 and organization_id=$2 and archived_at is null");
    assertContains(file, "where id=$1 and organization_id=$6 returning *");
    assertContains(file, "select overdue_policy from public.partners where id=$1 and organization_id=$2");
    assertContains(file, "lockInventoryProducts(client, order.organization_id, itemsResult.rows.map");
  });

  it("FEFO allocation is scoped to organization on lots", () => {
    const file = "src/app/api/orders/[id]/actions/route.ts";
    assertContains(file, "p.organization_id=l.organization_id and l.organization_id=$3");
    assertContains(file, "update public.orders set fulfillment_status=$2 where id=$1 and organization_id=$3 returning *");
    assertContains(file, "lockInventoryProductLocations(client, order.organization_id, items.rows.map");
  });

  it("scanner carton pick only touches own organization order and carton", () => {
    const file = "src/app/api/orders/[id]/carton-picks/route.ts";
    assertContains(file, "where id=$1 and organization_id=$2 and archived_at is null");
    assertContains(file, "where c.organization_id=$1 and upper(c.carton_code)=upper($2)");
    assertContains(file, "where id=$1 and organization_id=$2");
  });

  it("scanner carton unpick blocks active allocations outside the organization", () => {
    const file = "src/app/api/orders/[id]/carton-picks/route.ts";
    assertContains(file, "where a.carton_id=$1 and o.organization_id=$2 and a.status in ('allocated','picked')");
    assertContains(file, "update public.inventory_cartons set status='in_stock' where id=$1 and organization_id=$2");
  });

  it("internal order edit and delete validate organization on address and order updates", () => {
    const file = "src/app/api/orders/[id]/route.ts";
    assertContains(file, "validateDeliveryAddress(client, order.partner_id, order.organization_id");
    assertContains(file, "join public.partners p on p.id=a.partner_id");
    assertContains(file, "where id=$1 and organization_id=$11");
    assertContains(file, "where id=$1 and organization_id=$4");
  });

  it("LOT carton generation and label printing log only own organization lots and cartons", () => {
    assertContains("src/app/api/inventory/cartons/labels/generate/route.ts", "where l.id=$1 and l.organization_id=$2 and l.archived_at is null");
    assertContains("src/app/api/inventory/cartons/labels/generate/route.ts", "where organization_id=$1 and lot_id=$2 and archived_at is null");
    assertContains("src/app/api/inventory/cartons/labels/print/route.ts", "where c.organization_id=$1 and c.lot_id=$2 and c.id = any($3::bigint[])");
    assertContains("src/app/api/inventory/cartons/labels/print/route.ts", "for update of c");
  });

  it("partner ticket create and reply use only own partner and organization records", () => {
    assertContains("src/app/api/partner/support/route.ts", "where id=$1 and organization_id=$2 and active=true and archived_at is null");
    assertContains("src/app/api/partner/support/route.ts", "where partner_id=$1 and organization_id=$2 and order_number=$3");
    assertContains("src/app/api/support/tickets/[id]/messages/route.ts", "and ($3::boolean=false or st.partner_id=$4)");
  });

  it("task create validates linked partner, order, and assignee", () => {
    const file = "src/app/api/tasks/route.ts";
    assertContains(file, "from public.partners where id=$1 and organization_id=$2");
    assertContains(file, "where id=$1 and organization_id=$2 and archived_at is null");
    assertContains(file, "where user_id=$1 and organization_id=$2 and active=true and role<>'partner'");
  });

  it("shipment create and edit modify only own organization orders and deliveries", () => {
    assertContains("src/app/api/shipments/route.ts", "where id=$1 and organization_id=$2 and archived_at is null");
    assertContains("src/app/api/shipments/route.ts", "where id=$1 and organization_id=$7");
    assertContains("src/app/api/shipments/[id]/route.ts", "where id=$1 and organization_id=$2 and archived_at is null for update");
    assertContains("src/app/api/shipments/[id]/route.ts", "and d.organization_id=$4");
  });

  it("cron and email processing endpoints require bearer secret", () => {
    assertContains("src/app/api/cron/daily/route.ts", "requireSecret(request, process.env.CRON_SECRET)");
    assertContains("src/app/api/email/process/route.ts", "requireSecret(request, process.env.CRON_SECRET)");
    assertMatches("src/lib/http.ts", /header === `Bearer \$\{secret\}`/);
  });

  it("email outbox can be staged before live provider connection", () => {
    assertContains("src/lib/email.ts", "EMAIL_DELIVERY_MODE");
    assertContains("src/lib/email.ts", "dry_run");
    assertContains("src/lib/email.ts", "provider_message_id");
    assertContains("database/migrations/018_email_delivery_readiness.sql", "next_attempt_at");
    assertContains("database/migrations/018_email_delivery_readiness.sql", "email_outbox_queue_idx");
  });

  it("login and partner submission endpoints are rate limited", () => {
    assertContains("src/app/login/page.tsx", 'fetch("/api/auth/login"');
    assertContains("src/lib/rate-limit.ts", 'loginEmailIp: { scope: "auth.login.email_ip"');
    assertContains("src/lib/rate-limit.ts", "rate_limit_counters");
    assertContains("src/app/api/orders/route.ts", "RATE_LIMITS.partnerOrderSubmit");
    assertContains("src/app/api/partner/support/route.ts", "RATE_LIMITS.partnerTicketSubmit");
    assertContains("src/app/api/support/tickets/[id]/messages/route.ts", "RATE_LIMITS.partnerTicketMessage");
    assertContains("database/migrations/019_rate_limit_and_monitoring.sql", "rate_limit_counters");
  });

  it("application errors use structured monitoring logs", () => {
    assertContains("src/lib/http.ts", "reportError(error, context)");
    assertContains("src/lib/monitoring.ts", "ERROR_WEBHOOK_URL");
    assertContains("src/instrumentation.ts", "monitoring.registered");
    assertContains("src/app/api/health/route.ts", "monitoringStatus()");
  });

  it("inventory write flows use transaction-scoped advisory locks for race-sensitive balances", () => {
    assertContains("src/lib/inventory-locks.ts", "pg_advisory_xact_lock");
    assertContains("src/lib/inventory-locks.ts", "lockInventoryProducts");
    assertContains("src/app/api/inventory/corrections/route.ts", "lockInventoryProducts(client,organizationId");
    assertContains("src/app/api/inventory/cartons/move/route.ts", "lockInventoryProductLocations(client, organizationId");
    assertContains("src/app/api/recalls/route.ts", "lockInventoryProductLocations(client, organizationId");
  });
});
