import { notFound } from "next/navigation";
import Link from "next/link";
import PromotionsHeader from "@/components/PromotionsHeader";
import { getClickCounts } from "@/lib/clicks";
import { getStorePageData } from "@/lib/stores";
import type { Store } from "@/types/store";
import StorePageClient from "@/components/StorePageClient";

type Props = { params: Promise<{ slug: string }> };

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const [{ storeInfo, coupons, otherStores }, clickCounts] = await Promise.all([
    getStorePageData(slug),
    getClickCounts(),
  ]);
  if (!storeInfo) notFound();

  const codesCount = coupons.filter((c) => c.couponType === "code").length;
  const dealsCount = coupons.filter((c) => c.couponType !== "code").length;
  const visitUrl = storeInfo.trackingUrl || storeInfo.link || storeInfo.websiteUrl || "#";
  const displayName = storeInfo.subStoreName || storeInfo.name;

  const siteName = "SavingsHub4u";

  return (
    <div className="min-h-screen bg-white text-zinc-900" suppressHydrationWarning>
      <PromotionsHeader />
      {/* Breadcrumb strip - light peach/orange, centered Store title, current in blue */}
      <div className="border-b border-amber-200/60 bg-[#fff8f0]">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Store: {displayName}</h1>
          <nav className="mt-2 text-sm text-zinc-600" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center justify-center gap-1">
              <li>
                <Link href="/" className="hover:text-zinc-900">{siteName}</Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <Link href="/promotions" className="hover:text-zinc-900">Coupon</Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <span className="font-medium text-blue-600">{displayName}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StorePageClient
          storeInfo={storeInfo}
          coupons={coupons}
          otherStores={otherStores}
          codesCount={codesCount}
          dealsCount={dealsCount}
          visitUrl={visitUrl}
          clickCounts={clickCounts}
        />
      </main>

      {/* Newsletter - blue banner with left/right SVGs */}
      <section className="relative bg-blue-600 py-10">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-12 opacity-30 sm:px-20">
          <img src="/Group%201171275124.svg" alt="" className="h-24 w-24 shrink-0 object-contain sm:h-32 sm:w-32" />
          <img src="/Group%201171275125.svg" alt="" className="h-24 w-24 shrink-0 object-contain sm:h-32 sm:w-32" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Join our newsletter for updates!</h2>
          <p className="mt-2 text-sm text-blue-100">Join our community with more than 300K active users</p>
          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full max-w-xs rounded-lg border-0 px-4 py-3 text-zinc-900 shadow-sm focus:ring-2 focus:ring-amber-400 sm:max-w-sm"
            />
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer - no top margin so no white gap below blue newsletter */}
      <footer className="border-t border-blue-600 bg-amber-50/80 text-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-700">
                Useful Links
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/" className="hover:text-zinc-900">Home</Link></li>
                <li><Link href="/promotions/categories" className="hover:text-zinc-900">Categories</Link></li>
                <li><Link href="/promotions" className="hover:text-zinc-900">Stores</Link></li>
                <li><Link href="/promotions/share-a-coupon" className="hover:text-zinc-900">Share A Coupon</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-700">
                Information
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/about" className="hover:text-zinc-900">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-zinc-900">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-zinc-900">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-700">
                Events
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/deals/black-friday" className="hover:text-zinc-900">Black Friday</Link></li>
                <li><Link href="/deals/christmas" className="hover:text-zinc-900">Christmas</Link></li>
                <li><Link href="/deals/cyber-monday" className="hover:text-zinc-900">Cyber Monday</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-700">
                Promotions
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/promotions" className="hover:text-zinc-900">All Brands</Link></li>
                <li><Link href="/promotions/categories" className="hover:text-zinc-900">Categories</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-amber-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-zinc-900">Subscribe to our weekly newsletter</h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-teal-700"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-200 bg-zinc-100 px-4 py-4">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm text-zinc-600">Copyright © {new Date().getFullYear()} SavingsHub4u. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-600">
              <Link href="/contact" className="hover:text-zinc-900">Help &amp; Supports</Link>
              <Link href="/privacy" className="hover:text-zinc-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-zinc-900">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
