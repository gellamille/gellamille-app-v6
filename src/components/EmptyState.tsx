export function EmptyState({ children = "Nincs megjeleníthető adat." }: { children?: React.ReactNode }) {
  return <div className="empty-state">{children}</div>;
}
