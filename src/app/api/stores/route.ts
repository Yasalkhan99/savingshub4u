import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Store } from "@/types/store";

const getStoresPath = () => path.join(process.cwd(), "data", "stores.json");

async function readStores(): Promise<Store[]> {
  try {
    const filePath = getStoresPath();
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeStores(stores: Store[]) {
  const filePath = getStoresPath();
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
  await writeFile(filePath, JSON.stringify(stores, null, 2), "utf-8");
}

export async function GET() {
  const stores = await readStores();
  return NextResponse.json(stores);
}

function buildStoreFromBody(body: Record<string, unknown>, slugFromName: string): Store {
  const {
    name,
    logoUrl,
    description,
    expiry,
    link,
    subStoreName,
    slug,
    logoAltText,
    logoMethod,
    networkId,
    merchantId,
    trackingUrl,
    countryCodes,
    websiteUrl,
    category,
    whyTrustUs,
    moreInfo,
    seoTitle,
    seoMetaDesc,
    trending,
    status,
  } = body;
  return {
    id: crypto.randomUUID(),
    name: String(name ?? "").trim(),
    logoUrl: logoUrl ? String(logoUrl).trim() : "",
    description: String(description ?? "").trim(),
    expiry: expiry ? String(expiry).trim() : "Dec 31, 2026",
    link: link ? String(link).trim() : undefined,
    createdAt: new Date().toISOString(),
    ...(subStoreName != null && String(subStoreName).trim() !== "" && { subStoreName: String(subStoreName).trim() }),
    ...(slug != null && String(slug).trim() !== "" ? { slug: String(slug).trim() } : { slug: slugFromName }),
    ...(logoAltText != null && String(logoAltText).trim() !== "" && { logoAltText: String(logoAltText).trim() }),
    ...(logoMethod != null && { logoMethod: logoMethod === "upload" ? "upload" : "url" }),
    ...(networkId != null && String(networkId).trim() !== "" && { networkId: String(networkId).trim() }),
    ...(merchantId != null && String(merchantId).trim() !== "" && { merchantId: String(merchantId).trim() }),
    ...(trackingUrl != null && String(trackingUrl).trim() !== "" && { trackingUrl: String(trackingUrl).trim() }),
    ...(countryCodes != null && String(countryCodes).trim() !== "" && { countryCodes: String(countryCodes).trim() }),
    ...(websiteUrl != null && String(websiteUrl).trim() !== "" && { websiteUrl: String(websiteUrl).trim() }),
    ...(category != null && String(category).trim() !== "" && { category: String(category).trim() }),
    ...(whyTrustUs != null && String(whyTrustUs).trim() !== "" && { whyTrustUs: String(whyTrustUs).trim() }),
    ...(moreInfo != null && String(moreInfo).trim() !== "" && { moreInfo: String(moreInfo).trim() }),
    ...(seoTitle != null && String(seoTitle).trim() !== "" && { seoTitle: String(seoTitle).trim() }),
    ...(seoMetaDesc != null && String(seoMetaDesc).trim() !== "" && { seoMetaDesc: String(seoMetaDesc).trim() }),
    ...(trending === true && { trending: true }),
    ...(status === "disable" && { status: "disable" }),
    ...(status === "enable" && { status: "enable" }),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Bulk import: body.stores is array
    if (Array.isArray(body.stores) && body.stores.length > 0) {
      const stores = await readStores();
      const created: Store[] = [];
      for (const row of body.stores as Record<string, unknown>[]) {
        const name = row.name != null ? String(row.name).trim() : "";
        const description =
          (row.description != null && String(row.description).trim() !== "" ? String(row.description).trim() : null) ??
          (row.desc != null && String(row.desc).trim() !== "" ? String(row.desc).trim() : null) ??
          (row["Description"] != null && String(row["Description"]).trim() !== "" ? String(row["Description"]).trim() : null) ??
          (row.details != null && String(row.details).trim() !== "" ? String(row.details).trim() : null) ??
          name;
        if (!name) continue;
        const slugFromName = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        // Support multiple column names for logo (Logo URL, logo, logoUrl, etc.)
        const logoUrl =
          (row.logoUrl != null && String(row.logoUrl).trim() !== "" ? String(row.logoUrl).trim() : null) ??
          (row.logo != null && String(row.logo).trim() !== "" ? String(row.logo).trim() : null) ??
          (row["Logo URL"] != null && String(row["Logo URL"]).trim() !== "" ? String(row["Logo URL"]).trim() : null) ??
          (row.logo_url != null && String(row.logo_url).trim() !== "" ? String(row.logo_url).trim() : null) ??
          "";
        const normalizedRow = { ...row, name, description, logoUrl };
        const newStore = buildStoreFromBody(normalizedRow, slugFromName);
        if (row.couponCode != null && String(row.couponCode).trim() !== "") (newStore as Store).couponCode = String(row.couponCode).trim();
        if (row.couponTitle != null && String(row.couponTitle).trim() !== "") (newStore as Store).couponTitle = String(row.couponTitle).trim();
        const typeVal = String((row.couponType ?? row.type ?? "")).trim().toLowerCase();
        if (typeVal === "code") (newStore as Store).couponType = "code";
        else if (typeVal === "deal") (newStore as Store).couponType = "deal";
        if (row.status === "disable") (newStore as Store).status = "disable";
        if (row.status === "enable") (newStore as Store).status = "enable";
        stores.push(newStore);
        created.push(newStore);
      }
      if (created.length === 0) {
        return NextResponse.json({ error: "No valid rows (name required)" }, { status: 400 });
      }
      await writeStores(stores);
      return NextResponse.json({ imported: created.length, stores: created });
    }

    const {
      name,
      logoUrl,
      description,
      expiry,
      link,
      subStoreName,
      slug,
      logoAltText,
      logoMethod,
      networkId,
      merchantId,
      trackingUrl,
      countryCodes,
      websiteUrl,
      category,
      whyTrustUs,
      moreInfo,
      seoTitle,
      seoMetaDesc,
      trending,
      status,
      couponType,
      couponCode,
      couponTitle,
      priority,
      active,
      imageAlt,
    } = body;
    if (!name || !description) {
      return NextResponse.json(
        { error: "name and description required" },
        { status: 400 }
      );
    }
    const slugFromName = String(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const stores = await readStores();
    const newStore = buildStoreFromBody(
      {
        name,
        logoUrl,
        description,
        expiry,
        link,
        subStoreName,
        slug,
        logoAltText,
        logoMethod,
        networkId,
        merchantId,
        trackingUrl,
        countryCodes,
        websiteUrl,
        category,
        whyTrustUs,
        moreInfo,
        seoTitle,
        seoMetaDesc,
        trending,
        status,
      },
      slugFromName
    );
    (newStore as Store).couponType = couponType === "deal" ? "deal" : couponType === "code" ? "code" : undefined;
    if (couponCode != null && String(couponCode).trim() !== "") (newStore as Store).couponCode = String(couponCode).trim();
    if (couponTitle != null && String(couponTitle).trim() !== "") (newStore as Store).couponTitle = String(couponTitle).trim();
    if (priority != null && String(priority) !== "" && !Number.isNaN(Number(priority))) (newStore as Store).priority = Number(priority);
    if (active === false) (newStore as Store).active = false;
    if (active === true) (newStore as Store).active = true;
    if (imageAlt != null && String(imageAlt).trim() !== "") (newStore as Store).imageAlt = String(imageAlt).trim();
    stores.push(newStore);
    await writeStores(stores);
    return NextResponse.json(newStore);
  } catch (e) {
    return NextResponse.json({ error: "Failed to add store" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");
    const stores = await readStores();
    if (all === "true") {
      await writeStores([]);
      return NextResponse.json({ deleted: stores.length });
    }
    if (!id) {
      return NextResponse.json({ error: "id or all required" }, { status: 400 });
    }
    const nextStores = stores.filter((s) => s.id !== id);
    if (nextStores.length === stores.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await writeStores(nextStores);
    return NextResponse.json({ deleted: 1 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const stores = await readStores();
    const index = stores.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const current = stores[index];
    const allowed = [
      "name", "logoUrl", "description", "expiry", "link", "subStoreName", "slug",
      "logoAltText", "logoMethod", "networkId", "merchantId", "trackingUrl", "countryCodes",
      "websiteUrl", "category", "whyTrustUs", "moreInfo", "seoTitle", "seoMetaDesc",
      "trending", "status", "couponType", "couponCode", "couponTitle", "priority", "active", "imageAlt",
    ];
    const nextStore = { ...current };
    for (const key of allowed) {
      if (key in updates && updates[key] !== undefined) {
        (nextStore as Record<string, unknown>)[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
      }
    }
    stores[index] = nextStore;
    await writeStores(stores);
    return NextResponse.json(nextStore);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
