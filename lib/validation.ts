/**
 * Minimal form validation.
 *
 * Deliberately dependency-free: zod + react-hook-form would add ~20kb gzip to
 * the two forms on this site, which works against the performance budget. The
 * surface here (required / email / phone / length / range / cross-field) is
 * everything those forms actually need.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Deliberately permissive — the goal is catching typos, not policing formats.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

export const validators = {
  required:
    (label: string) =>
    (value: unknown): string | undefined =>
      typeof value === "string" && value.trim().length > 0
        ? undefined
        : `${label} is required`,

  email: (value: string): string | undefined =>
    EMAIL_RE.test(value.trim()) ? undefined : "Enter a valid email address",

  phone: (value: string): string | undefined =>
    PHONE_RE.test(value.trim())
      ? undefined
      : "Enter a valid phone number, e.g. +254 700 000 000",

  minLength:
    (min: number, label: string) =>
    (value: string): string | undefined =>
      value.trim().length >= min
        ? undefined
        : `${label} must be at least ${min} characters`,

  maxLength:
    (max: number, label: string) =>
    (value: string): string | undefined =>
      value.trim().length <= max
        ? undefined
        : `${label} must be ${max} characters or fewer`,

  range:
    (min: number, max: number, label: string) =>
    (value: number): string | undefined => {
      if (!Number.isFinite(value)) return `${label} must be a number`;
      if (value < min) return `${label} must be at least ${min}`;
      if (value > max) return `${label} must be ${max} or fewer`;
      return undefined;
    },
};

/** Run a set of rules per field and collect the first failure for each. */
export function validate<T extends Record<string, unknown>>(
  values: T,
  rules: {
    [K in keyof T]?: Array<(value: T[K], all: T) => string | undefined>;
  }
): FieldErrors<T> {
  const errors: FieldErrors<T> = {};

  for (const key of Object.keys(rules) as Array<keyof T>) {
    for (const rule of rules[key] ?? []) {
      const message = rule(values[key], values);
      if (message) {
        errors[key] = message;
        break;
      }
    }
  }

  return errors;
}

/**
 * Coerce a numeric input's value. An emptied `<input type="number">` yields
 * `""`, and `Number("")` is 0 while `Number("abc")` is NaN — both of which
 * used to reach the booking mutation unchecked.
 */
export function toNumber(raw: string, fallback: number): number {
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Wire a field's error to its control for assistive tech. */
export function fieldProps(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
