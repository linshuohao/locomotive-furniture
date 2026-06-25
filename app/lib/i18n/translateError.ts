export function translateErrorKey(
  t: (key: string) => string,
  te: (key: string) => boolean,
  key: string,
  fallbackKey = 'checkout.errors.failed',
): string {
  return te(key) ? t(key) : t(fallbackKey)
}
