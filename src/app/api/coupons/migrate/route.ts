import { NextResponse } from "next/server";
import { getSupabase, SUPABASE_STORES_TABLE, SUPABASE_COUPONS_TABLE } from "@/lib/supabase-server";
import { hasCouponData } from "@/lib/store-utils";

/** Move coupon rows from stores table to coupons table. Run once after creating the coupons table. */
export async function POST() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
        { status: 503 }
      );
    }
    const { data: storeRows, error: readErr } = await supabase.from(SUPABASE_STORES_TABLE).select("id, data");
    if (readErr) {
      return NextResponse.json({ error: readErr.message }, { status: 500 });
    }
    const rows = (storeRows ?? []) as { id: string; data: Record<string, unknown> }[];
    const toMigrate = rows.filter((r) => hasCouponData(r.data as { couponCode?: string; couponTitle?: string }));
    if (toMigrate.length === 0) {
      return NextResponse.json({ migrated: 0, message: "No coupon rows found in stores table." });
    }
    const toInsert = toMigrate.map((r) => ({ id: r.id, data: r.data }));
    const { error: insertErr } = await supabase.from(SUPABASE_COUPONS_TABLE).insert(toInsert);
    if (insertErr) {
      return NextResponse.json({ error: `Coupons insert failed: ${insertErr.message}` }, { status: 500 });
    }
    for (const r of toMigrate) {
      const { error: delErr } = await supabase.from(SUPABASE_STORES_TABLE).delete().eq("id", r.id);
      if (delErr) {
        return NextResponse.json(
          { error: `Failed to delete store row ${r.id}: ${delErr.message}` },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ migrated: toMigrate.length, ids: toMigrate.map((r) => r.id) });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
