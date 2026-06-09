/**
 * Auth library: JWT + password hashing
 * Replaces Supabase Auth with self-built auth system
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-in-production"
);
const COOKIE_NAME = "auth_token";
const JWT_EXPIRES_IN = "7d";

/** Hash a password using bcrypt */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/** Verify a password against its hash */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Sign a JWT for the given user ID */
export async function signJWT(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/** Verify a JWT and return its payload */
export async function verifyJWT(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

/** Server-side: get current user from cookie (for API routes & server components) */
export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = await verifyJWT(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: {
        id: true,
        phone: true,
        displayName: true,
        role: true,
        credits: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

/** Set auth cookie (server-side) */
export async function setAuthCookie(userId: string) {
  const token = await signJWT(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/** Clear auth cookie (server-side) */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
