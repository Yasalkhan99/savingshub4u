import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Store } from "@/types/store";

const getClicksPath = () => path.join(process.cwd(), "data", "clicks.json");
const getStoresPath = () => path.join(process.cwd(), "data", "stores.json");

type ClickRecord = { id: string; storeId: string; createdAt: string };

async function readClicks(): Promise<ClickRecord[]> {
  try {
    const data = await readFile(getClicksPath(), "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function readStores(): Promise<Store[]> {
  try {
    const data = await readFile(getStoresPath(), "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const [clicks, stores] = await Promise.all([readClicks(), readStores()]);
  const storeMap = new Map(stores.map((s) => [s.id, s]));

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfWeekIso = startOfWeek.toISOString();

  const clicksToday = clicks.filter((c) => c.createdAt >= startOfToday).length;
  const clicksThisWeek = clicks.filter((c) => c.createdAt >= startOfWeekIso).length;

  const byStoreId = new Map<string, number>();
  for (const c of clicks) {
    byStoreId.set(c.storeId, (byStoreId.get(c.storeId) ?? 0) + 1);
  }

  const byStore = Array.from(byStoreId.entries())
    .map(([storeId, count]) => ({
      storeId,
      storeName: storeMap.get(storeId)?.name ?? storeId,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const totalCoupons = stores.length;
  const codesCount = stores.filter((s) => s.couponType === "code").length;
  const dealsCount = totalCoupons - codesCount;

  const topCoupons = byStore.slice(0, 5).map((row) => {
    const store = storeMap.get(row.storeId);
    const total = clicks.length || 1;
    const pct = ((row.count / total) * 100).toFixed(1);
    return {
      storeId: row.storeId,
      code: store?.couponCode ?? store?.name?.slice(0, 12) ?? row.storeId.slice(0, 8),
      uses: row.count,
      pct: `${pct}%`,
    };
  });

  return NextResponse.json({
    totalClicks: clicks.length,
    clicksToday,
    clicksThisWeek,
    countries: 0,
    byStore,
    topCoupons,
    totalCoupons,
    codesCount: codesCount || 0,
    dealsCount: dealsCount || 0,
    expiringSoon: 0,
    avgUsageRate: totalCoupons ? ((clicks.length / totalCoupons) * 100).toFixed(1) : "0.0",
  });
}
