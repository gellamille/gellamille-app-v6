import { randomInt } from "crypto";

const LOWER = "abcdefghijkmnopqrstuvwxyz";
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%";
const ALL = LOWER + UPPER + DIGITS + SYMBOLS;

function pick(source: string) {
  return source[randomInt(source.length)];
}

export function generateTemporaryPassword(length = 14) {
  const chars = [
    pick(LOWER),
    pick(UPPER),
    pick(DIGITS),
    pick(SYMBOLS)
  ];

  while (chars.length < length) chars.push(pick(ALL));

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.join("");
}
