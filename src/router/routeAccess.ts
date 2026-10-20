const PROTECTED_ROUTE_PATTERNS = [/^\/settings(?:\/|$)/];

function normalizeBasePath(basePath: string): string {
  if (!basePath || basePath === "/") return "";
  return `/${basePath.split("/").filter(Boolean).join("/")}`;
}

export function getProtectedRouteRedirect(path: string, isAuthenticated: boolean): string | null {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (isAuthenticated || !PROTECTED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname))) return null;
  return `/login?redirect=${encodeURIComponent(path)}`;
}

export function resolveInternalRedirect(target: string, basePath = ""): string {
  const base = normalizeBasePath(basePath);
  try {
    const resolved = new URL(target, "https://damsel.invalid");
    if (resolved.origin !== "https://damsel.invalid") return "/";
    let pathname = resolved.pathname;
    if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
      pathname = pathname.slice(base.length) || "/";
    }
    if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
    return `${pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return "/";
  }
}

export function buildAuthCallbackUrl(target: string, origin: string, basePath = ""): string {
  const base = normalizeBasePath(basePath);
  const safeTarget = resolveInternalRedirect(target, base);
  const resolved = new URL(safeTarget, "https://damsel.invalid");
  const pathname = resolved.pathname;
  const prefixedPath = pathname === "/" ? `${base}/` || "/" : `${base}${pathname}`;
  return `${origin.replace(/\/$/, "")}${prefixedPath}${resolved.search}${resolved.hash}`;
}
