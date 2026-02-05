import { NextResponse } from "next/server";

const WEBMAIL_URL = "https://cpanel1.hostingwinds.online:2096/";

export function GET() {
  return NextResponse.redirect(WEBMAIL_URL, 302);
}
