export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="route-loading-spinner" />
      <span>Adatok betöltése…</span>
    </div>
  );
}
