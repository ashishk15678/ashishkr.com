import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — Security hardening & server identity removal
 *
 * This middleware runs on every matched request and:
 *   1. Strips server-identification headers (x-powered-by, server)
 *   2. Adds a minimal fingerprint-resistant server header
 *
 * HTML minification is handled by the post-build script (scripts/minify-html.mjs),
 * not here — Edge Middleware cannot rewrite response bodies.
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Remove server identification headers
  response.headers.delete("x-powered-by");
  response.headers.delete("server");

  // Generic server header to obscure technology stack
  response.headers.set("server", "web");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO/browser files)
     * - Static asset file extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff|woff2|ttf|otf|map|mp4|webm|pdf|zip|txt|xml|json)).*)",
  ],
};
