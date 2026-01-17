"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function getTenantSlugFromPath(pathname: string | null | undefined) {
  if (!pathname) return "";
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "store") return segments[1] || "";
  return segments[0] || "";
}

function getTenantSlugFromCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )tenant-slug=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function useTenantSlug(fallback?: string) {
  const pathname = usePathname();

  return useMemo(() => {
    const slugFromPath = getTenantSlugFromPath(pathname);
    const slugFromCookie = slugFromPath ? "" : getTenantSlugFromCookie();
    return (
      slugFromPath ||
      slugFromCookie ||
      process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG ||
      fallback ||
      ""
    );
  }, [pathname, fallback]);
}
