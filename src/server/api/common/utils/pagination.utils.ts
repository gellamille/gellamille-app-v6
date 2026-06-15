export function normalizePagination(page?: number, pageSize?: number) {
  const normalizedPage = Math.max(1, page ?? 1);
  const normalizedPageSize = Math.min(100, Math.max(1, pageSize ?? 25));
  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
    skip: (normalizedPage - 1) * normalizedPageSize,
  };
}
