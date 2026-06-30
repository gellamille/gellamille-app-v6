import type { PoolClient } from "pg";

const INVENTORY_LOCK_NAMESPACE = 7311;

async function lockInventoryKey(client: PoolClient, key: string) {
  await client.query(`select pg_advisory_xact_lock($1::integer, hashtext($2)::integer)`, [INVENTORY_LOCK_NAMESPACE, key]);
}

export async function lockInventoryProductLocations(
  client: PoolClient,
  organizationId: number,
  productLocationPairs: Array<{ productId: number; locationId: number }>
) {
  const keys = [...new Set(productLocationPairs.map((pair) => (
    `org:${organizationId}:product:${pair.productId}:location:${pair.locationId}`
  )))].sort();

  for (const key of keys) {
    await lockInventoryKey(client, key);
  }
}

export async function lockInventoryProducts(
  client: PoolClient,
  organizationId: number,
  productIds: number[]
) {
  const keys = [...new Set(productIds.map((productId) => `org:${organizationId}:product:${productId}`))].sort();

  for (const key of keys) {
    await lockInventoryKey(client, key);
  }
}

export async function lockInventoryLots(
  client: PoolClient,
  organizationId: number,
  lotIds: number[]
) {
  const keys = [...new Set(lotIds.map((lotId) => `org:${organizationId}:lot:${lotId}`))].sort();

  for (const key of keys) {
    await lockInventoryKey(client, key);
  }
}
