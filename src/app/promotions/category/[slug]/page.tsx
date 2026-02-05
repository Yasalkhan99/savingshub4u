import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PromotionsHeader from "@/components/PromotionsHeader";
import CategoriesSidebar from "@/components/CategoriesSidebar";
import Pagination from "@/components/Pagination";
import { getStores, slugify } from "@/lib/stores";

const PER_PAGE = 24;

function categoryToSlug(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug: categorySlug } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(String(pageStr || "1"), 10) || 1);
  const slugLower = categorySlug.toLowerCase();
  const stores = await getStores();
  const enabled = stores.filter((s) => s.status !== "disable");
  const isOther = slugLower === "other";
  const inCategory = enabled.filter((s) => {
    const cat = s.category?.trim();
    if (isOther) return !cat;
    if (!cat) return false;
    return categoryToSlug(cat) === slugLower;
  });

  if (inCategory.length === 0) {
    notFound();
  }

  const categoryName = isOther ? "Other" : (inCategory[0].category!);
  const uniqueStores = inCategory.filter(
    (s, i, arr) => arr.findIndex((x) => x.name?.toLowerCase() === s.name?.toLowerCase()) === i
  );
  const totalPages = Math.max(1, Math.ceil(uniqueStores.length / PER_PAGE));
  const pageStores = uniqueStores.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const basePath = `/promotions/category/${categorySlug}`;

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
            <li>
              <Link href="/promotions" className="hover:text-zinc-700">
                Promotions
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href="/promotions/categories" className="hover:text-zinc-700">
                Categories
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-zinc-900 font-medium">{categoryName}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left: Category name + stores grid */}
          <div className="min-w-0 flex-1">
            <h1 className="mb-6 text-2xl font-bold text-zinc-900">{categoryName}</h1>
            <p className="mb-4 text-sm text-zinc-500">
              {uniqueStores.length} {uniqueStores.length === 1 ? "brand" : "brands"} in this category
              {totalPages > 1 && (
                <> · Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, uniqueStores.length)}</>
              )}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageStores.map((store) => (
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
                    <h2 className="mb-4 text-lg font-bold text-zinc-900">{store.name}</h2>
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
                    View coupons
                  </Link>
                </article>
              ))}
            </div>
            <Pagination
              basePath={basePath}
              currentPage={currentPage}
              totalPages={totalPages}
              searchParams={pageStr ? { page: pageStr } : {}}
            />
          </div>

          <CategoriesSidebar />
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-200 bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Important Links
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/promotions" className="hover:text-white">Brands</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/promotions/categories" className="hover:text-white">Categories</Link></li>
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
