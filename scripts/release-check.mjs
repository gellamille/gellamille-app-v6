import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const productionUrl = process.env.RELEASE_CHECK_URL || "https://gellamille-app-v6.vercel.app";
const requiredEnv = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRON_SECRET"
];

const checks = [];

function pass(name, detail = "") {
  checks.push({ ok: true, name, detail });
}

function fail(name, detail = "") {
  checks.push({ ok: false, name, detail });
}

function loadDotEnvValues() {
  const values = new Map();
  for (const file of [".env", ".env.local", ".env.production", ".env.production.local"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      values.set(key.trim(), rest.join("=").trim().replace(/^['"]|['"]$/g, ""));
    }
  }
  return values;
}

function run(name, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: "utf8",
    env: process.env
  });
  if (result.status === 0) {
    pass(name, options.capture ? result.stdout.trim() : "");
  } else {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    fail(name, output || `${command} ${args.join(" ")} sikertelen (${result.status ?? "n/a"})`);
  }
  return result;
}

function checkEnv() {
  const dotEnv = loadDotEnvValues();
  const missing = requiredEnv.filter((key) => !process.env[key] && !dotEnv.get(key));
  const hasVercelLink = existsSync(join(root, ".vercel", "project.json"));
  if (!missing.length) {
    pass("env presence", "Required variables found in process env or .env files.");
    return;
  }
  if (hasVercelLink && process.env.RELEASE_CHECK_STRICT_ENV !== "1") {
    pass("env presence", `Missing locally: ${missing.join(", ")}. Vercel project is linked; use RELEASE_CHECK_STRICT_ENV=1 for strict local env checks.`);
    return;
  }
  fail("env presence", `Missing variables: ${missing.join(", ")}`);
}

function checkMigrations() {
  const dir = join(root, "database", "migrations");
  if (!existsSync(dir)) {
    fail("migration directory", "database/migrations not found");
    return;
  }
  const files = readdirSync(dir).filter((file) => file.endsWith(".sql")).sort();
  const prefixes = files.map((file) => file.match(/^(\d+)_/)?.[1]).filter(Boolean);
  const duplicate = prefixes.find((prefix, index) => prefixes.indexOf(prefix) !== index);
  const unsorted = files.some((file, index) => index > 0 && files[index - 1].localeCompare(file) > 0);
  if (!files.length) fail("migration files", "No SQL migration files found.");
  else if (duplicate) fail("migration order", `Duplicate prefix: ${duplicate}`);
  else if (unsorted) fail("migration order", "Migration file names are not stably sortable.");
  else pass("migration order", `${files.length} files, no duplicate numeric prefixes.`);
}

async function checkHealth() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${productionUrl.replace(/\/$/, "")}/api/health`, { signal: controller.signal });
    const text = await response.text();
    if (!response.ok) {
      fail("/api/health", `HTTP ${response.status}: ${text.slice(0, 500)}`);
      return;
    }
    pass("/api/health", text.slice(0, 500));
  } catch (error) {
    fail("/api/health", error instanceof Error ? error.message : String(error));
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  checkEnv();
  checkMigrations();
  run("critical API tests", "npm", ["run", "test:api"]);
  run("typecheck", "npm", ["run", "typecheck"]);
  run("build", "npm", ["run", "build"]);
  await checkHealth();
  const status = run("git status", "git", ["status", "--short"], { capture: true });
  if (status.status === 0 && status.stdout.trim()) {
    pass("git status", `Changes present before commit:\n${status.stdout.trim()}`);
  }

  console.log("\nRelease check summary:");
  for (const check of checks) {
    console.log(`${check.ok ? "OK" : "HIBA"} - ${check.name}${check.detail ? `: ${check.detail}` : ""}`);
  }

  if (checks.some((check) => !check.ok)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
