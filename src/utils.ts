/** Prefix an internal path with the configured base URL */
export function url(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (base && path.startsWith('/')) {
    return `${base}${path}`;
  }
  return path;
}
