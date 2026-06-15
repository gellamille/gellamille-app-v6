import assert from 'node:assert/strict';
import test from 'node:test';
import { addCalendarMonths, formatDateOnly, lotNumber, parseDateOnly } from './date.utils';

test('calendar-month expiry clamps to month end', () => {
  const result = addCalendarMonths(parseDateOnly('2026-11-30'), 3);
  assert.equal(formatDateOnly(result), '2027-02-28');
});

test('lot number keeps per-product annual format', () => {
  assert.equal(lotNumber('FDP', 150, parseDateOnly('2026-06-14'), 12), 'FDP15-26-0012');
});


test('invalid calendar date is rejected', () => {
  assert.throws(() => parseDateOnly('2026-02-31'));
});
