import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

async function isAuthed(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (await isAuthed(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
