type Props = {
  value: string;
  label?: string;
};

export function StatusBadge({ value, label }: Props) {
  return <span className={`badge badge-${value}`}>{label ?? value}</span>;
}
