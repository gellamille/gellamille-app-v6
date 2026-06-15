export function parseDateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid date-only value: ${value}`);

  const [, year, month, day] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (formatDateOnly(parsed) !== value) {
    throw new Error(`Invalid date-only value: ${value}`);
  }
  return parsed;
}

export function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function addCalendarMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const targetStart = new Date(Date.UTC(year, month + months, 1));
  const lastDay = new Date(
    Date.UTC(targetStart.getUTCFullYear(), targetStart.getUTCMonth() + 1, 0),
  ).getUTCDate();

  return new Date(
    Date.UTC(
      targetStart.getUTCFullYear(),
      targetStart.getUTCMonth(),
      Math.min(day, lastDay),
    ),
  );
}

export function lotNumber(
  flavorCode: string,
  sizeMl: 150 | 300,
  productionDate: Date,
  batchNo: number,
): string {
  const sizeCode = sizeMl === 150 ? '15' : '30';
  const year = String(productionDate.getUTCFullYear()).slice(-2);
  return `${flavorCode}${sizeCode}-${year}-${String(batchNo).padStart(4, '0')}`;
}
