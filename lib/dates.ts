// Dates arrive in two shapes: "2026-08-12" from the Studio date picker, and
// free text like "12 August 2026" in documents written before it existed (and
// in json/). Both sort and display the same way through these helpers.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseDate(value?: string | null): Date | null {
  const text = value?.trim() ?? "";
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));

  m = /^(\d{1,2})\s+([A-Za-z]{3,})\.?\s+(\d{4})$/.exec(text);
  if (!m) return null;
  const prefix = m[2].slice(0, 3).toLowerCase();
  const month = MONTHS.findIndex((name) => name.toLowerCase().startsWith(prefix));
  return month === -1 ? null : new Date(Date.UTC(+m[3], month, +m[1]));
}

export function toIsoDate(value?: string | null) {
  return parseDate(value)?.toISOString().slice(0, 10) ?? "";
}

// "12 August 2026"; text that is not a date is shown as typed.
export function formatDate(value?: string | null) {
  const d = parseDate(value);
  if (!d) return value ?? "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Undated items sort as oldest.
export function dateValue(value?: string | null) {
  return parseDate(value)?.getTime() ?? 0;
}
