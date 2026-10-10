/**
 * Secure ID generators for user-visible document / claim / voucher tracking codes.
 *
 * These are NOT real cryptographic signatures — they are stable, unique identifiers
 * meant to be displayed to end-users. They use the Web Crypto API
 * (`crypto.getRandomValues`) which is non-deterministic and far stronger than
 * `Math.random()` while still being synchronous and browser-native.
 *
 * If you need real PKI / signature handling, integrate with a backend service
 * that issues signed tracking IDs (e.g. via a KMS / HMAC of the document hash).
 */

/** Returns `n` cryptographically-secure base-10 digits as a string. */
function secureDigits(n: number): string {
  const max = 10 ** n;
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  // Strip the leading zero so a 6-digit code never starts with 0
  const value = 1 + (arr[0] % (max - 1));
  return String(value).padStart(n, '0');
}

/**
 * Generate a short, stable document tracking identifier such as
 * `DOC-9F3A2C7B-4821`. The hex segment is derived from a single 32-bit
 * CSPRNG draw, which is sufficient for client-side display IDs.
 */
export function generateDocumentId(prefix = 'DOC'): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const hex = buf[0].toString(16).toUpperCase().padStart(8, '0');
  const suffix = secureDigits(4);
  return `${prefix}-${hex}-${suffix}`;
}

/** Generate a dossier tracking code such as `DOS-1403-8AF2C901`. */
export function generateDossierId(year: number | string = new Date().getFullYear()): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const hex = buf[0].toString(16).toUpperCase().padStart(8, '0');
  return `DOS-${year}-${hex}`;
}

/** Generate a voucher tracking code such as `VOUCH-7F2A19C4`. */
export function generateVoucherId(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const hex = buf[0].toString(16).toUpperCase().padStart(8, '0');
  return `VOUCH-${hex}`;
}

/** Generate a legal-export tracking number such as `IR-LEG-A1B2C3D4`. */
export function generateLegalTrackingId(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const hex = buf[0].toString(16).toUpperCase().padStart(8, '0');
  return `IR-LEG-${hex}`;
}
