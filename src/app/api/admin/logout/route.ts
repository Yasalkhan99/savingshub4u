import { NextResponse } from "next/server";
import { getCookieName } from "@/lib/admin-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), "", {
    path: "/admin",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  return res;
}
