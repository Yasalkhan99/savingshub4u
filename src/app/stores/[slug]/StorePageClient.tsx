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
}: Props) {
  const [filter, setFilter] = useState<"all" | "code" | "deal">("all");
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
        {/* Left Sidebar */}
        <aside className="order-1 shrink-0 lg:w-72">
          <div className="sticky top-4 space-y-6">
            {/* About [Store] Coupon Code */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-800">
                About {displayName} Coupon Code
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-zinc-600">
                {storeInfo.description || `Save with verified ${displayName} coupon codes and deals. We hand-test every offer so you can shop with confidence.`}
              </p>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <dt className="text-zinc-500">Total Coupons</dt>
                  <dd className="font-semibold text-zinc-900">{coupons.length}</dd>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <dt className="text-zinc-500">Active Codes</dt>
                  <dd className="font-semibold text-zinc-900">{codesCount}</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt className="text-zinc-500">Active Deals</dt>
                  <dd className="font-semibold text-zinc-900">{dealsCount}</dd>
                </div>
              </dl>
              <h3 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-zinc-600">
                Popular {displayName} Coupon Categories
              </h3>
              <ul className="space-y-1.5 text-sm">
                {categoryLinks.map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="text-teal-600 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top [Store] Coupon Codes */}
            {topCodes.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-800">
                  Top {displayName} Coupon Codes
                </h2>
                <ul className="space-y-2 text-sm text-zinc-700">
                  {topCodes.map((c) => (
                    <li key={c.id} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                      <span>{c.couponTitle || (c.couponCode ? `Use code ${c.couponCode}` : "Deal")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* New [Store] Coupon Codes */}
            {newCodes.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-800">
                  New {displayName} Coupon Codes
                </h2>
                <ul className="space-y-2 text-sm text-zinc-700">
                  {newCodes.map((c) => (
                    <li key={c.id} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                      <span>{c.couponTitle || (c.couponCode ? `Use code ${c.couponCode}` : "Deal")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visit Store */}
            <a
              href={visitUrl.startsWith("http") ? visitUrl : `https://${visitUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-teal-600 px-4 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Visit Store
            </a>

            {otherStores.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-600">
                  Related Stores
                </h3>
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

        {/* Main Content */}
        <div className="order-2 min-w-0 flex-1">
          {/* Tabs: All | Coupons | Deals */}
          <div className="mb-6 flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
            {(["all", "code", "deal"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  filter === f
                    ? "bg-blue-600 text-white shadow"
                    : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                {f === "all" ? "All" : f === "code" ? "Coupons" : "Deals"}
              </button>
            ))}
          </div>

          <h2 className="mb-4 text-xl font-bold text-zinc-900">
            {displayName} Coupon
          </h2>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500 shadow-sm">
              No offers in this category.
            </div>
          ) : (
            <ul className="space-y-4">
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
                  ? new Date(c.expiry).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
                  : "01/01/2027";
                const dateAvailable = c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
                  : "01/01/2025";
                const usedCount = 900 + (index % 200);
                const partialReveal = isCode && c.couponCode ? String(c.couponCode).slice(-2) : String(percent);
                return (
                  <li
                    key={c.id}
                    className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-md sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        {/* Circular % OFF badge */}
                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-blue-500 bg-white">
                          <span className="text-lg font-bold leading-tight text-zinc-900">{percent}%</span>
                          <span className="text-[10px] font-semibold uppercase leading-tight text-zinc-600">OFF</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-zinc-900">
                            {dealTitle.includes("%") ? dealTitle : `${percent}% Off ${displayName} Coupon Code`}
                          </h3>
                        </div>
                      </div>
                      {/* GET CODE + partial reveal */}
                      <div className="relative flex shrink-0 items-center group">
                        <button
                          type="button"
                          onClick={handleCouponClick}
                          className="h-10 rounded-full bg-blue-600 pl-6 pr-14 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          {isCode ? "Get Code" : "Get Deal"}
                        </button>
                        <span
                          className="pointer-events-none absolute right-9 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[20px] border-l-[16px] border-y-transparent border-l-amber-400"
                          aria-hidden
                        />
                        <span
                          className="pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-zinc-400 bg-white text-sm font-bold text-transparent transition-colors group-hover:text-zinc-700"
                          aria-hidden
                        >
                          {partialReveal}
                        </span>
                      </div>
                    </div>
                    {/* Bottom row: Used, Date Available, Expiry Date */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                      <span>Used {usedCount} Times.</span>
                      <span>Date Available: {dateAvailable}</span>
                      <span className="sm:ml-auto">Expiry Date: {expiryDate}</span>
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
