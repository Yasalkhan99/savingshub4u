import path from "path";
import { readFile } from "fs/promises";
import type { Store } from "@/types/store";
import { slugify } from "./slugify";
import { getSupabase, SUPABASE_STORES_TABLE } from "./supabase-server";
import { hasCouponData } from "./store-utils";

const getStoresPath = () => path.join(process.cwd(), "data", "stores.json");

export { slugify };

async function getStoresFromFile(): Promise<Store[]> {
  try {
    const filePath = getStoresPath();
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getStores(): Promise<Store[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data: rows, error } = await supabase.from(SUPABASE_STORES_TABLE).select("data");
    if (!error && rows?.length) {
      const stores = rows.map((r: { data: Store }) => r.data).filter(Boolean);
      stores.sort((a, b) => ((b.createdAt ?? "").localeCompare(a.createdAt ?? "")));
      return stores;
    }
  }
  return getStoresFromFile();
}

export type StorePageData = {
  storeInfo: Store | null;
  coupons: Store[];
  otherStores: Store[];
};

/** Normalize slug for matching: strip -coupon-code / -coupon so same store matches regardless of URL. */
export function canonicalSlug(s: string): string {
  const lower = s.toLowerCase().trim();
  if (lower.endsWith("-coupon-code")) return lower.slice(0, -"-coupon-code".length);
  if (lower.endsWith("-coupon")) return lower.slice(0, -"-coupon".length);
  return lower;
}

export { hasCouponData } from "./store-utils";

export async function getStorePageData(slug: string): Promise<StorePageData> {
  const all = await getStores();
  const enabled = all.filter((s) => s.status !== "disable");
  const wantRaw = slug.toLowerCase().trim();
  const wantCanonical = canonicalSlug(wantRaw);
  const matching = enabled.filter((s) => {
    const sSlug = (s.slug || slugify(s.name)).toLowerCase().trim();
    const sCanonical = canonicalSlug(sSlug);
    const nameSlug = s.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return (
      sSlug === wantRaw ||
      sCanonical === wantCanonical ||
      nameSlug === wantRaw ||
      canonicalSlug(nameSlug) === wantCanonical
    );
  });
  const storeRow = matching.find((r) => !hasCouponData(r));
  const rowWithLogo = matching.find((r) => (r.logoUrl ?? "").trim() !== "");
  const storeInfo = storeRow ?? rowWithLogo ?? matching[0] ?? null;
  const coupons = matching.filter(hasCouponData);
  const currentName = storeInfo?.name?.toLowerCase();
  const otherStores = enabled
    .filter((s) => s.name?.toLowerCase() !== currentName)
    .reduce((acc: Store[], s) => {
      if (acc.some((x) => x.name?.toLowerCase() === s.name?.toLowerCase())) return acc;
      acc.push(s);
      return acc;
    }, [])
    .slice(0, 12);
  return { storeInfo, coupons, otherStores };
}
