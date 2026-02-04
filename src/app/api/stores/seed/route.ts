import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Store } from "@/types/store";
import { getSupabase, SUPABASE_STORES_TABLE } from "@/lib/supabase-server";

const BATCH_SIZE = 50;

export async function POST() {
  let imported = 0;
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "data", "stores.json");
    const raw = await readFile(filePath, "utf-8");
    const stores: Store[] = JSON.parse(raw);
    if (!Array.isArray(stores) || stores.length === 0) {
      return NextResponse.json({ error: "No stores in file", imported: 0 }, { status: 400 });
    }

    // Upsert in batches (no delete – upsert replaces by id)
    for (let i = 0; i < stores.length; i += BATCH_SIZE) {
      const batch = stores.slice(i, i + BATCH_SIZE);
      const rows = batch.map((s) => ({ id: s.id, data: JSON.parse(JSON.stringify(s)) }));
      const { error } = await supabase
        .from(SUPABASE_STORES_TABLE)
        .upsert(rows, { onConflict: "id" });
      if (error) {
        return NextResponse.json(
          { error: error.message, details: error.details, imported, batchIndex: i },
          { status: 500 }
        );
      }
      imported += batch.length;
    }

    return NextResponse.json({ success: true, imported });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message, imported }, { status: 500 });
  }
}
