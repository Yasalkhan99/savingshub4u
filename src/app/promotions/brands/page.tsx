import Link from "next/link";
import Image from "next/image";
import PromotionsFooter from "@/components/PromotionsFooter";
import PromotionsHeader from "@/components/PromotionsHeader";
import { getStores, slugify } from "@/lib/stores";

export default async function BrandsPage() {
  const stores = await getStores();

  return (
    <div className="min-h-screen bg-white text-zinc-900" suppressHydrationWarning>
      <PromotionsHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-zinc-700">
                SavingsHub4u
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href="/promotions" className="hover:text-zinc-700">Promotions</Link>
            </li>
            <li aria-hidden>›</li>
            <li className="font-medium text-zinc-900">Brands</li>
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
                  href={`/promotions/${store.slug || slugify(store.name)}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <PromotionsFooter />
    </div>
  );
}
