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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PromotionsHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Verified {storeInfo.subStoreName || storeInfo.name} Coupons &amp; Promo Codes
          </h1>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            {storeInfo.logoUrl && (
              <div className="relative h-14 w-32 shrink-0">
                <Image
                  src={storeInfo.logoUrl}
                  alt={storeInfo.logoAltText || storeInfo.name}
                  fill
                  className="object-contain object-left"
                  sizes="128px"
                  unoptimized
                />
              </div>
            )}
            <span className="text-sm font-medium text-zinc-500">Trusted Partner since 2026</span>
          </div>
          <p className="text-sm text-zinc-600">
            {coupons.length} Coupon{coupons.length !== 1 ? "s" : ""} validated by our experts on{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
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

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </span>
              SavingsHub4u
            </Link>
            <p className="text-sm text-zinc-400">© {new Date().getFullYear()} SavingsHub4u. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
