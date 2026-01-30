import path from "path";
import { readFile } from "fs/promises";
import type { Store } from "@/types/store";
import { slugify } from "./slugify";

const getStoresPath = () => path.join(process.cwd(), "data", "stores.json");

export { slugify };

export async function getStores(): Promise<Store[]> {
  try {
    const filePath = getStoresPath();
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export type StorePageData = {
  storeInfo: Store | null;
  coupons: Store[];
  otherStores: Store[];
};

export async function getStorePageData(slug: string): Promise<StorePageData> {
  const all = await getStores();
  const enabled = all.filter((s) => s.status !== "disable");
  const coupons = enabled.filter((s) => {
    const sSlug = (s.slug || slugify(s.name)).toLowerCase();
    const want = slug.toLowerCase();
    return sSlug === want || s.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") === want;
  });
  const storeInfo = coupons[0] ?? null;
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
