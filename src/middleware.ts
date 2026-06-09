import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-in-production"
);

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const protectedPaths = [
    "/workspace",
    "/create",
    "/my-works",
    "/profile",
    "/admin",
  ];
  const authPaths = ["/login", "/register"];

  const isProtectedPath = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );
  const isAuthPath = authPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  const authed = await isAuthenticated(request);

  if (isProtectedPath && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/workspace";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
