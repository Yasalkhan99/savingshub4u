import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PromotionsHeader from "@/components/PromotionsHeader";
import { getStorePageData } from "@/lib/stores";
import type { Store } from "@/types/store";
import StorePageClient from "./StorePageClient";

type Props = { params: Promise<{ slug: string }> };

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const { storeInfo, coupons, otherStores } = await getStorePageData(slug);
  if (!storeInfo) notFound();

  const codesCount = coupons.filter((c) => c.couponType === "code").length;
  const dealsCount = coupons.filter((c) => c.couponType !== "code").length;
  const visitUrl = storeInfo.trackingUrl || storeInfo.link || storeInfo.websiteUrl || "#";
  const displayName = storeInfo.subStoreName || storeInfo.name;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PromotionsHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-zinc-700">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href="/promotions" className="hover:text-zinc-700">
                Stores
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-zinc-900 font-medium">{displayName} Coupon Code</li>
          </ol>
        </nav>

        {/* Hero: circular logo + title */}
        <div className="mb-8 flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-50">
            {storeInfo.logoUrl ? (
              <Image
                src={storeInfo.logoUrl}
                alt={storeInfo.logoAltText || storeInfo.name}
                width={80}
                height={80}
                className="h-full w-full object-contain"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-teal-600">
                {storeInfo.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
              {displayName} Coupon Code
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {coupons.length} Coupon{coupons.length !== 1 ? "s" : ""} · Verified &amp; hand-tested
            </p>
          </div>
        </div>

        <StorePageClient
          storeInfo={storeInfo}
          coupons={coupons}
          otherStores={otherStores}
          codesCount={codesCount}
          dealsCount={dealsCount}
          visitUrl={visitUrl}
        />
      </main>

      {/* Footer - peach/sand style */}
      <footer className="mt-16 border-t border-zinc-200 bg-amber-50/80 text-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-700">
                Useful Links
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/" className="hover:text-zinc-900">Home</Link></li>
                <li><Link href="/categories" className="hover:text-zinc-900">Categories</Link></li>
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
                <li><Link href="/categories" className="hover:text-zinc-900">Categories</Link></li>
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
        <div className="border-t border-amber-200/60 bg-amber-100/50 px-4 py-4">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </span>
              SavingsHub4u
            </Link>
            <p className="text-sm text-zinc-600">© {new Date().getFullYear()} SavingsHub4u. All Rights Reserved.</p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900" aria-label="Facebook">FB</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900" aria-label="Twitter">TW</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900" aria-label="Instagram">IG</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900" aria-label="Pinterest">Pin</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
