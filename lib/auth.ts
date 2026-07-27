import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (32+ chars recommended)");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(getSecret());
  return token;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
