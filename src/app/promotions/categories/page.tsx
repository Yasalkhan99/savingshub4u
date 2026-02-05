import Link from "next/link";
import PromotionsHeader from "@/components/PromotionsHeader";
import CategoryIcon from "@/components/CategoryIcon";
import CategoriesSidebar from "@/components/CategoriesSidebar";
import { getStores } from "@/lib/stores";

function slug(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default async function CategoriesPage() {
  const stores = await getStores();
  const enabled = stores.filter((s) => s.status !== "disable");
  const categoryCounts = enabled.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category?.trim();
    const key = cat || "Other";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const categoriesWithCount = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (a.name === "Other" ? 1 : b.name === "Other" ? -1 : a.name.localeCompare(b.name, undefined, { sensitivity: "base" })));

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
            <li className="font-medium text-zinc-900">Categories</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <h1 className="mb-6 text-2xl font-bold text-zinc-900">Categories</h1>
            {categoriesWithCount.length === 0 ? (
              <p className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 text-sm text-zinc-500">
                No categories yet. Categories appear when stores have a category set in the admin.
              </p>
            ) : (
              <ul className="space-y-3">
                {categoriesWithCount.map(({ name, count }) => (
                  <li key={name}>
                    <Link
                      href={`/promotions/category/${slug(name)}`}
                      className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 hover:shadow"
                    >
                      <CategoryIcon categoryName={name} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-zinc-900">{name}</span>
                        <p className="text-sm text-zinc-500">
                          {count} {count === 1 ? "brand" : "brands"}
                        </p>
                      </div>
                      <span className="shrink-0 text-zinc-400" aria-hidden>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <CategoriesSidebar />
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-200 bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Favorite Categories
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                {categoriesWithCount.length === 0 ? (
                  <li className="text-zinc-500">No categories yet.</li>
                ) : (
                  categoriesWithCount.map(({ name }) => (
                    <li key={name}>
                      <Link href={`/promotions/category/${slug(name)}`} className="hover:text-white">
                        {name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Important Links
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/promotions/brands" className="hover:text-white">Brands</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Imprint</Link></li>
                <li><Link href="/promotions/share-a-coupon" className="hover:text-white">Share A Coupon</Link></li>
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
