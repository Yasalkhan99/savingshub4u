import Link from "next/link";
import Image from "next/image";
import PromotionsHeader from "@/components/PromotionsHeader";
import { getStores, slugify } from "@/lib/stores";

export default async function BrandsPage() {
  const stores = await getStores();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PromotionsHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-zinc-700">
                SavingsHub4u
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-zinc-900 font-medium">Brands</li>
          </ol>
        </nav>

        <h1 className="mb-2 text-2xl font-bold uppercase tracking-wide text-zinc-900">
          All Brands
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          {stores.length} stores listed
        </p>

        {stores.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 py-16 text-center">
            <p className="mb-2 text-zinc-600">
              No stores yet. Add coupons and deals from the admin panel.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Go to Admin
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stores.map((store) => (
              <article
                key={store.id}
                className="flex flex-col overflow-hidden rounded-lg border border-zinc-100 bg-white p-5 shadow-md transition hover:shadow-lg"
              >
                {store.logoUrl ? (
                  <div className="relative mb-4 h-16 w-full">
                    <Image
                      src={store.logoUrl}
                      alt={store.name}
                      fill
                      className="object-contain object-left"
                      sizes="200px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <h3 className="mb-4 text-lg font-bold text-zinc-900">
                    {store.name}
                  </h3>
                )}
                <p className="mb-4 flex-1 text-sm text-zinc-600 line-clamp-2">
                  {store.description}
                </p>
                <div className="mb-3 text-xs text-zinc-500">
                  Expiry: {store.expiry}
                </div>
                <Link
                  href={`/stores/${store.slug || slugify(store.name)}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200 bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Favorite Categories
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link href="/promotions" className="hover:text-white">Promotions</Link></li>
                <li><Link href="/promotions/share-a-coupon" className="hover:text-white">Share A Coupon</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Important Links
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/promotions" className="hover:text-white">Brands</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Imprint</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Events
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/deals/black-friday" className="hover:text-white">Black Friday Coupons/Deals</Link></li>
                <li><Link href="/deals/christmas" className="hover:text-white">Christmas Coupons/Deals</Link></li>
                <li><Link href="/deals/cyber-monday" className="hover:text-white">Cyber Monday Coupons/Deals</Link></li>
                <li><Link href="/deals/easter" className="hover:text-white">Easter Coupons/Deals</Link></li>
                <li><Link href="/deals/halloween" className="hover:text-white">Halloween Coupons/Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Connect With Us
              </h4>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="Facebook">FB</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="Instagram">IG</a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="Pinterest">Pin</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="YouTube">YT</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
          <div className="mx-auto max-w-6xl text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
            <p>Copyright © {new Date().getFullYear()} SavingsHub4u. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
