import { Pool, PoolClient, QueryResultRow } from "pg";

declare global {
  var gellamillePool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("A DATABASE_URL környezeti változó hiányzik.");
  }

  return new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000
  });
}

export function getPool() {
  const pool = global.gellamillePool ?? createPool();

  if (process.env.NODE_ENV !== "production") {
    global.gellamillePool = pool;
  }

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, values);
  return result.rows;
}

export async function one<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, values);
  return rows[0] ?? null;
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
