import Link from 'next/link';

export function Pagination({ page, totalPages, path, query = {} }: { page: number; totalPages: number; path: string; query?: Record<string, string | undefined> }) {
  const href = (target: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value && params.set(key, value));
    params.set('page', String(target));
    return `${path}?${params.toString()}`;
  };

  return (
    <div className="pagination">
      {page > 1 ? <Link className="button button-secondary button-small" href={href(page - 1)}>Előző</Link> : null}
      <span>{page} / {Math.max(1, totalPages)}</span>
      {page < totalPages ? <Link className="button button-secondary button-small" href={href(page + 1)}>Következő</Link> : null}
    </div>
  );
}
