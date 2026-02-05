"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Store } from "@/types/store";
import { slugify } from "@/lib/slugify";
import CouponRevealModal from "@/components/CouponRevealModal";

type Props = {
  storeInfo: Store;
  coupons: Store[];
  otherStores: Store[];
  codesCount: number;
  dealsCount: number;
  visitUrl: string;
  clickCounts: Record<string, number>;
};

const DEFAULT_WHY_TRUST =
  "We verify and hand-test offers so you can shop with confidence. Our team updates deals regularly to bring you the best savings.";

const DEFAULT_FAQS = [
  { q: "What is a discount code?", a: "A discount code is a promo code you enter at checkout to get a percentage or fixed amount off your order." },
  { q: "How do I use a promo code?", a: "Copy the code from our page, go to the store website, add items to cart, and paste the code in the checkout or promo field." },
  { q: "Are these codes free to use?", a: "Yes. All codes and deals listed here are free for shoppers. We may earn a commission when you use our links, at no extra cost to you." },
];

const SHOPPING_TIPS = [
  "Check for limited-time offers and expiry dates before using a code.",
  "Sign up for the store's email newsletter to get exclusive codes.",
  "Try stacking a promo code with existing sales for maximum savings.",
  "Copy the code before clicking through—some codes are one-time use.",
];

/** Extract percentage from title (e.g. "10% Off" -> 10), else default */
function getPercentFromTitle(title: string, defaultPercent = 10): number {
  const match = title.match(/(\d+)\s*%\s*off/i) || title.match(/(\d+)\s*%/i);
  if (match) return Math.min(99, Math.max(1, parseInt(match[1], 10)));
  return defaultPercent;
}

export default function StorePageClient({
  storeInfo,
  coupons,
  otherStores,
  codesCount,
  dealsCount,
  visitUrl,
  clickCounts: initialClickCounts,
}: Props) {
  const [filter, setFilter] = useState<"all" | "code" | "deal">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"ending" | "newest" | "used">("ending");
  const [extraClicks, setExtraClicks] = useState<Record<string, number>>({});
  const [revealingCoupon, setRevealingCoupon] = useState<{
    code: string;
    title: string;
    storeName: string;
    storeLogo: string;
    redirect: string;
    storeId: string;
  } | null>(null);

  const filtered =
    filter === "all"
      ? coupons
      : filter === "code"
        ? coupons.filter((c) => c.couponType === "code")
        : coupons.filter((c) => c.couponType !== "code");

  const whyTrustUs = storeInfo.whyTrustUs?.trim() || DEFAULT_WHY_TRUST;
  const moreInfo = storeInfo.moreInfo?.trim();
  const displayName = storeInfo.subStoreName || storeInfo.name;
  const faqsToShow = Array.isArray(storeInfo.faqs) && storeInfo.faqs.length > 0
    ? storeInfo.faqs.filter((f) => (String(f?.q ?? "").trim() !== "" || String(f?.a ?? "").trim() !== ""))
    : DEFAULT_FAQS;

  const topCodes = coupons.filter((c) => c.couponType === "code").slice(0, 5);
  const newCodes = coupons.slice(0, 5);
  const bestPercent = coupons.length > 0
    ? Math.max(...coupons.map((c) => getPercentFromTitle(c.couponTitle || c.couponCode || "", 10)), 10)
    : 25;
  const locationLabel = storeInfo.countryCodes?.trim() || "Worldwide";

  const categoryLinks = [
    { label: `${displayName} Free Shipping Coupons`, href: "#" },
    { label: `${displayName} Student Discount`, href: "#" },
    { label: `${displayName} First Order Discount`, href: "#" },
  ];

  return (
    <>
      {revealingCoupon && (
        <CouponRevealModal
          {...revealingCoupon}
          onClose={() => setRevealingCoupon(null)}
          blurBackdrop
        />
      )}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        {/* Left Sidebar - Couponly style */}
        <aside className="order-1 shrink-0 lg:w-72">
          <div className="sticky top-4 space-y-6">
            {/* Store card: blue circle, Up To X% OFF, GO TO SHOP, location */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white">
                  {storeInfo.logoUrl ? (
                    <div className="relative h-full w-full">
                      <Image src={storeInfo.logoUrl} alt={storeInfo.logoAltText || storeInfo.name} fill className="object-contain p-2" sizes="96px" unoptimized />
                    </div>
                  ) : (
                    <span className="text-2xl font-bold">{displayName.slice(0, 4).toUpperCase()}</span>
                  )}
                </div>
                <p className="mt-3 text-sm font-bold text-zinc-900">Up To {bestPercent}% OFF</p>
                <a
                  href={visitUrl.startsWith("http") ? visitUrl : `https://${visitUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  GO TO SHOP
                </a>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {locationLabel}
                </p>
              </div>
            </div>

            {/* Deals or coupon - tabs */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-800">Deals or coupon</h2>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setFilter("code")}
                  className={`rounded px-3 py-2 text-xs font-semibold uppercase transition ${filter === "code" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                >
                  Online Codes
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded px-3 py-2 text-xs font-semibold uppercase transition ${filter === "all" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                >
                  Store Codes
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("deal")}
                  className={`rounded px-3 py-2 text-xs font-semibold uppercase transition ${filter === "deal" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                >
                  Online Sales
                </button>
              </div>
            </div>

            {/* About Store */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-800">About Store</h2>
              <p className="text-sm leading-relaxed text-zinc-600">
                {storeInfo.description || `${displayName} offers verified coupon codes and deals. Save with hand-tested offers.`}
              </p>
            </div>

            {otherStores.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-600">Related Stores</h3>
                <div className="grid grid-cols-3 gap-2">
                  {otherStores.slice(0, 9).map((s) => (
                    <Link
                      key={s.id}
                      href={`/stores/${s.slug || slugify(s.name)}`}
                      className="flex flex-col items-center gap-1 rounded-lg border border-zinc-100 p-2 transition hover:border-zinc-200 hover:bg-zinc-50"
                    >
                      {s.logoUrl ? (
                        <div className="relative h-8 w-8">
                          <Image src={s.logoUrl} alt={s.name} fill className="object-contain" sizes="32px" unoptimized />
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-zinc-600">{s.name.slice(0, 2)}</span>
                      )}
                      <span className="truncate text-xs text-zinc-600" title={s.name}>{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content - Right column */}
        <div className="order-2 min-w-0 flex-1">
          {/* Found X coupon(s) + grid/list + sort */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-700">
              Found {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex rounded border border-zinc-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
                  aria-label="Grid view"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
                  aria-label="List view"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "ending" | "newest" | "used")}
                className="rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ending">Ending Soon</option>
                <option value="newest">Newest</option>
                <option value="used">Most Used</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500 shadow-sm">
              No offers in this category.
            </div>
          ) : (
            <ul className={viewMode === "grid" ? "grid gap-5 sm:grid-cols-2 sm:gap-6" : "space-y-6"}>
              {filtered.map((c, index) => {
                const href = c.link || visitUrl;
                const isCode = c.couponType === "code";
                const clickUrl = href.startsWith("http")
                  ? `/api/click?storeId=${encodeURIComponent(c.id)}&redirect=${encodeURIComponent(href)}`
                  : href;
                const dealTitle = c.couponTitle || (isCode ? `Use code ${c.couponCode || ""}` : "Deal");
                const percent = getPercentFromTitle(dealTitle, 10 + (index % 4) * 10);
                const revealParams = new URLSearchParams({
                  code: c.couponCode || "",
                  title: dealTitle,
                  storeName: storeInfo.name,
                  storeLogo: storeInfo.logoUrl || "",
                  redirect: href,
                  storeId: c.id,
                });
                const handleCouponClick = () => {
                  setExtraClicks((prev) => ({ ...prev, [c.id]: (prev[c.id] ?? 0) + 1 }));
                  setRevealingCoupon({
                    code: c.couponCode || "",
                    title: dealTitle,
                    storeName: storeInfo.name,
                    storeLogo: storeInfo.logoUrl || "",
                    redirect: href,
                    storeId: c.id,
                  });
                  window.open(`/coupon/reveal?${revealParams.toString()}`, "_blank", "noopener,noreferrer");
                  window.open(clickUrl, "_blank", "noopener,noreferrer");
                };
                const expiryDate = c.expiry
                  ? new Date(c.expiry).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                  : "31 Dec, 2027";
                const clickCount = (initialClickCounts[c.id] ?? 0) + (extraClicks[c.id] ?? 0);
                const partialReveal = c.couponCode && String(c.couponCode).trim().length >= 2
                  ? String(c.couponCode).trim().slice(-2)
                  : String(percent);
                return (
                  <li
                    key={c.id}
                    className={`flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md ${viewMode === "grid" ? "items-stretch gap-5 p-6" : "sm:flex-row sm:items-center sm:gap-6 sm:p-6"}`}
                  >
                    {/* Circular discount box - orange gradient */}
                    <div className="flex shrink-0 items-center justify-center">
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-inner sm:h-28 sm:w-28">
                        <span className="text-lg font-bold leading-tight sm:text-xl">{percent}%</span>
                        <span className="text-[10px] font-semibold uppercase leading-tight opacity-95 sm:text-xs">OFF</span>
                        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wide opacity-90 sm:text-[10px]">Savingshub4u</span>
                      </div>
                    </div>
                    <div className={`flex min-w-0 flex-1 flex-col items-start text-left p-5 pt-0 ${viewMode === "list" ? "sm:flex-row sm:items-center sm:justify-between sm:pt-5" : "sm:pt-0"}`}>
                      <div className="min-w-0 w-full flex-1 space-y-2">
                        {c.trending === true && (
                          <span className="mb-1 inline-block rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">Exclusive</span>
                        )}
                        <p className="flex items-center gap-1.5 text-left text-xs text-zinc-500">
                          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {expiryDate}
                        </p>
                        <h3 className="text-left font-bold text-zinc-900">
                          {dealTitle.includes("%") ? dealTitle : `${percent}% Off All Products - Limited Stock`}
                        </h3>
                        <p className="flex items-center gap-1 text-left text-xs text-zinc-500" title="Clicks">
                          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122m2.122-10.606l2.12 2.122M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {clickCount} click{clickCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="mt-5 flex w-full flex-shrink-0 items-center justify-start gap-3 sm:mt-0 sm:w-auto">
                        <button
                          type="button"
                          onClick={handleCouponClick}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          {isCode ? "GET CODE" : "GET DEAL"}
                        </button>
                        <span className="flex items-center gap-1 text-xs text-zinc-500" title="Comments">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          0
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Shopping Tips */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              {displayName} Coupon Code Shopping Tips
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
              {SHOPPING_TIPS.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>

          {/* Introduction */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              {displayName} Introduction
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              {storeInfo.description || `Save more with verified ${displayName} coupon codes and promo deals. We update our list regularly and hand-test offers so you can shop with confidence.`}
            </p>
          </section>

          {/* Terms */}
          {moreInfo && (
            <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">
                Terms Of {displayName}
              </h2>
              <div
                className="prose prose-zinc max-w-none text-sm text-zinc-600"
                dangerouslySetInnerHTML={{ __html: moreInfo }}
              />
            </section>
          )}

          {/* Popular offers */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              Popular {displayName} offers
            </h2>
            <p className="text-sm text-zinc-600">
              Our most used {displayName} coupons include free shipping, percentage-off sitewide, and first-order discounts. Check the list above for the latest active codes and deals.
            </p>
          </section>

          {/* How To Use */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              How To Use {displayName} Coupons
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600">
              <li>Find a code or deal you want to use from the list above.</li>
              <li>Click &quot;Get Code&quot; or &quot;Get Deal&quot; to reveal and copy the offer.</li>
              <li>Visit the store website and add items to your cart.</li>
              <li>At checkout, paste the code in the promo or discount field, or follow the deal instructions.</li>
              <li>Complete your purchase to save.</li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              {displayName} coupon and promo codes FAQ
            </h2>
            <div className="space-y-3">
              {faqsToShow.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-zinc-100 bg-zinc-50/50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-left font-medium text-zinc-900 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="shrink-0 text-zinc-400 transition group-open:rotate-180">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <p className="border-t border-zinc-100 px-4 py-3 text-sm text-zinc-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* How To Redeem */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              How To Redeem Your {displayName} Coupon Code
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              After clicking &quot;Get Code&quot;, copy the code and go to {displayName}&apos;s website. Add items to your cart, proceed to checkout, and enter the code in the designated promo or discount code box. Click apply and complete your order to receive the discount.
            </p>
          </section>

          {/* Why Trust Us */}
          <section className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-zinc-900">
              Why Trust Us?
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">{whyTrustUs}</p>
          </section>
        </div>
      </div>
    </>
  );
}
