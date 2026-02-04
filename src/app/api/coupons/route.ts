import { NextResponse } from "next/server";
import { getCoupons } from "@/lib/stores";

export async function GET() {
  const coupons = await getCoupons();
  return NextResponse.json(coupons);
}
