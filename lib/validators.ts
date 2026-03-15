export function cleanText(value: unknown, maxLen: number): string {
  const text = (typeof value === "string" ? value : "").trim();
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

export function isValidEmail(email: string): boolean {
  // Simple MVP check (not a full RFC parser)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

