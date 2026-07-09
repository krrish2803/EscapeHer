import { ROUTES, SIDEBAR_NAV, PUBLIC_ROUTES, PROTECTED_ROUTES } from "@/constants/routes";

/**
 * Re-exported route configuration for the config layer.
 * Components that import from `@/config/routes` get the same constants.
 */
export { ROUTES, SIDEBAR_NAV, PUBLIC_ROUTES, PROTECTED_ROUTES };

/**
 * Helper — check whether a given pathname is a public (unauthenticated) route.
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Helper — check whether a given pathname is a protected (authenticated) route.
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Breadcrumb generation from a pathname.
 */
export function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));
}
