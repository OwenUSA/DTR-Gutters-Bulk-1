import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  clearSessionCookie();
  return NextResponse.redirect(new URL("/admin/login", process.env.SITE_URL || "http://localhost:3000"));
}
