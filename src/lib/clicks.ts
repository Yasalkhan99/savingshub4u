import { readFile } from "fs/promises";
import path from "path";

const getClicksPath = () => path.join(process.cwd(), "data", "clicks.json");

type ClickRecord = { id: string; storeId: string; createdAt: string };

async function readClicks(): Promise<ClickRecord[]> {
  try {
    const data = await readFile(getClicksPath(), "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/** Returns click count per coupon/store id (storeId in clicks = coupon id when clicked from store page). */
export async function getClickCounts(): Promise<Record<string, number>> {
  const clicks = await readClicks();
  const counts: Record<string, number> = {};
  for (const c of clicks) {
    counts[c.storeId] = (counts[c.storeId] ?? 0) + 1;
  }
  return counts;
}
