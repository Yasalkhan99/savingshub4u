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

export default function StorePageClient({
  storeInfo,
  coupons,
  otherStores,
  codesCount,
  dealsCount,
  visitUrl,
}: Props) {
  const [tab, setTab] = useState<"coupons" | "info" | "faqs">("coupons");
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

  return (
    <>
      {revealingCoupon && (
        <CouponRevealModal
          {...revealingCoupon}
          onClose={() => setRevealingCoupon(null)}
          blurBackdrop
        />
      )}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      {/* Sidebar */}
      <aside className="order-2 shrink-0 lg:order-1 lg:w-72">
        <div className="sticky top-4 space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            {storeInfo.logoUrl && (
              <div className="relative mb-4 h-16 w-full">
                <Image
                  src={storeInfo.logoUrl}
                  alt={storeInfo.logoAltText || storeInfo.name}
                  fill
                  className="object-contain object-left"
                  sizes="200px"
                  unoptimized
                />
              </div>
            )}
            <a
              href={visitUrl.startsWith("http") ? visitUrl : `https://${visitUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-amber-500 px-4 py-3 text-center font-semibold text-zinc-900 shadow-sm transition hover:bg-amber-400"
            >
              Visit Store
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Get latest {storeInfo.name} Coupons and Deals
            </h3>
            <p className="mb-3 text-xs text-zinc-500">Verified and updated</p>
            <ul className="space-y-1 text-sm text-zinc-700">
              <li>Active Coupons: {codesCount}</li>
              <li>Active Deals: {dealsCount}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Why Trust Us?
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600">{whyTrustUs}</p>
          </div>

          {otherStores.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-600">
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

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
          {(["coupons", "info", "faqs"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition ${
                tab === t ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {t === "coupons" ? "Coupons" : t === "info" ? "Store Info" : "FAQs"}
            </button>
          ))}
        </div>

        {tab === "coupons" && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", "code", "deal"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    filter === f
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {f === "all" ? "All" : f === "code" ? `Coupons (${codesCount})` : `Deals (${dealsCount})`}
                </button>
              ))}
            </div>

            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              {storeInfo.name} Coupons
            </h2>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
                No offers in this category.
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.map((c) => {
                  const href = c.link || visitUrl;
                  const isCode = c.couponType === "code";
                  const clickUrl = href.startsWith("http")
                    ? `/api/click?storeId=${encodeURIComponent(c.id)}&redirect=${encodeURIComponent(href)}`
                    : href;
                  const dealTitle = c.couponTitle || (isCode ? `Use code ${c.couponCode || ""}` : "Deal");
                  const partialCode = isCode && c.couponCode
                    ? `...${String(c.couponCode).slice(-2)}`
                    : "...";
                  const revealParams = new URLSearchParams({
                    code: c.couponCode || "",
                    title: dealTitle,
                    storeName: storeInfo.name,
                    storeLogo: storeInfo.logoUrl || "",
                    redirect: href,
                    storeId: c.id,
                  });
                  const revealUrl = `/coupon/reveal?${revealParams.toString()}`;
                  const handleCouponClick = () => {
                    setRevealingCoupon({
                      code: c.couponCode || "",
                      title: dealTitle,
                      storeName: storeInfo.name,
                      storeLogo: storeInfo.logoUrl || "",
                      redirect: href,
                      storeId: c.id,
                    });
                    window.open(revealUrl, "_blank", "noopener,noreferrer");
                    window.open(clickUrl, "_blank", "noopener,noreferrer");
                  };

                  return (
                    <li
                      key={c.id}
                      className="group/card flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-zinc-900">
                          {dealTitle}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600">
                          {isCode ? `${storeInfo.name} Verified & Hand-Tested Code` : "Verified & Hand-Tested Deal"}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                          <span className="inline-block h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </span>
                          Verified {c.expiry ? new Date(c.expiry).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Dec 31, 2026"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCouponClick}
                        className="get-code-btn group/btn flex shrink-0 items-center justify-center gap-0 overflow-hidden rounded-r-xl rounded-l-lg border-2 border-red-500 bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:border-zinc-900 hover:bg-zinc-900 hover:text-red-400"
                      >
                        <span className="py-0.5">{isCode ? "Get Code" : "Get Deal"}</span>
                        <span className="get-code-partial ml-0 w-0 overflow-hidden border-l-0 border-red-400/0 py-0.5 pl-0 text-red-400 transition-all duration-200 group-hover/btn:ml-2 group-hover/btn:w-auto group-hover/btn:border-l-2 group-hover/btn:border-red-400 group-hover/btn:pl-2">
                          {isCode ? partialCode : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {tab === "info" && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">About {storeInfo.name}</h2>
            <div className="prose prose-zinc max-w-none text-sm text-zinc-600">
              {storeInfo.description || "No additional store information available."}
            </div>
          </div>
        )}

        {tab === "faqs" && (
          <div className="space-y-3">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              Frequently Asked Questions About {storeInfo.name} Coupons &amp; Deals
            </h2>
            {DEFAULT_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-4 text-left font-medium text-zinc-900 [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="shrink-0 text-zinc-400 transition group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <p className="border-t border-zinc-100 px-5 py-4 text-sm text-zinc-600">{faq.a}</p>
              </details>
            ))}
          </div>
        )}

        {/* More Information */}
        {moreInfo && (
          <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              More Information On {storeInfo.name} Coupons
            </h2>
            <div
              className="prose prose-zinc max-w-none text-sm text-zinc-600"
              dangerouslySetInnerHTML={{ __html: moreInfo }}
            />
          </section>
        )}

        {/* Email signup */}
        <section className="mt-10 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-50 p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-zinc-900">Daily Exclusive Deals</h2>
          <p className="mb-4 text-sm text-zinc-600">
            Get exclusive coupons and best deals delivered to your inbox.
          </p>
          <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Email Address"
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Unlock Deals
            </button>
          </form>
        </section>
      </div>
    </div>
    </>
  );
}
