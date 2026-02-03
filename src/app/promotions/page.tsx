import Link from "next/link";
import Image from "next/image";
import PromotionsHeader from "@/components/PromotionsHeader";
import { getStores, slugify } from "@/lib/stores";
import { getBlogData } from "@/lib/blog";
import { stripHtml } from "@/lib/slugify";

const PROMO_CATEGORIES = [
  { name: "Baby & Kids", icon: "👶", accent: "from-rose-100 to-pink-100" },
  { name: "Books & Magazines", icon: "📚", accent: "from-amber-100 to-orange-100" },
  { name: "Entertainment", icon: "🎧", accent: "from-violet-100 to-purple-100" },
  { name: "Finance & Insurance", icon: "💰", accent: "from-emerald-100 to-teal-100" },
  { name: "Food & Beverage", icon: "🍔", accent: "from-amber-100 to-yellow-100" },
  { name: "Sports & Outdoors", icon: "🎾", accent: "from-green-100 to-emerald-100" },
  { name: "Travel", icon: "✈️", accent: "from-sky-100 to-blue-100" },
  { name: "Women's Fashion", icon: "👗", accent: "from-fuchsia-100 to-pink-100" },
  { name: "Beauty & Skin", icon: "💄", accent: "from-rose-100 to-red-100" },
  { name: "Pet Care", icon: "🐾", accent: "from-lime-100 to-green-100" },
  { name: "Home & Garden", icon: "🏠", accent: "from-teal-100 to-cyan-100" },
  { name: "Electronics", icon: "📱", accent: "from-slate-100 to-zinc-200" },
];

export default async function PromotionsPage() {
  const stores = await getStores();
  const { featuredPosts } = await getBlogData();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PromotionsHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Featured Coupons And Deals */}
        <section className="mb-14">
          <h1 className="mb-6 text-2xl font-bold uppercase tracking-wide text-zinc-900">
            Featured Coupons And Deals
          </h1>
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
        </section>

        {/* Featured Blogs */}
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-zinc-900">
            Featured Blogs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-md transition hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={post.image}
                    alt={stripHtml(post.title)}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-600">
                    {post.category}
                  </span>
                  <h3 className="mb-2 line-clamp-2 text-base font-bold text-zinc-900 group-hover:text-blue-600 [&_a]:text-red-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: post.title }} />
                  <div className="blog-content mb-3 flex-1 line-clamp-2 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  <span className="text-sm font-medium text-blue-600 group-hover:underline">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
            >
              View all articles →
            </Link>
          </div>
        </section>

        {/* Sign up for newsletter + About (side by side) */}
        <section className="mb-14 grid gap-8 border-y border-zinc-200 py-12 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xl font-bold uppercase tracking-wide text-zinc-900">
              Sign up for newsletter
            </h2>
            <p className="mb-4 max-w-md text-sm text-zinc-600">
              Get the best deals and coupon codes delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="min-w-0 flex-1 rounded-full border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-3 font-semibold uppercase tracking-wide text-white hover:bg-blue-700"
              >
                Sign Up
              </button>
            </form>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold uppercase tracking-wide text-zinc-900">
              About SavingsHub4u
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-600">
              We help you save money by finding the best deals, coupons, and promotions from your favorite stores.
              Browse our featured coupons and stay updated with the latest offers.
            </p>
          </div>
        </section>

        {/* Popular Stores & Brands */}
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-bold uppercase tracking-wide text-zinc-900">
            Popular Stores & Brands
          </h2>
          {stores.length === 0 ? (
            <p className="text-sm text-zinc-500">Stores added from admin will appear here.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {stores
                .filter((s, i, arr) => arr.findIndex((x) => x.name?.toLowerCase() === s.name?.toLowerCase()) === i)
                .map((store) => (
                  <Link
                    key={store.id}
                    href={`/stores/${store.slug || slugify(store.name)}`}
                    className="text-sm font-medium text-zinc-700 hover:text-blue-600 hover:underline"
                  >
                    {store.name}
                  </Link>
                ))}
            </div>
          )}
        </section>

        {/* Categories - auto-scroll horizontal carousel */}
        <section className="mb-14 overflow-hidden">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-zinc-900">
            Categories
          </h2>
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max animate-scroll-left gap-5">
              {[...PROMO_CATEGORIES, ...PROMO_CATEGORIES].map((cat, i) => (
                <Link
                  key={`${cat.name}-${i}`}
                  href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group flex shrink-0 flex-col items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-md"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accent} text-2xl transition-transform duration-200 group-hover:scale-105`}
                    aria-hidden
                  >
                    {cat.icon}
                  </span>
                  <span className="max-w-[110px] text-center text-sm font-medium leading-tight text-zinc-700 group-hover:text-zinc-900">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - dark, four columns */}
      <footer className="mt-12 border-t border-zinc-200 bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                SavingsHub4u
              </Link>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">About</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/advertise" className="hover:text-white">Advertise With Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/reward" className="hover:text-white">Reward</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Browser</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/promotions" className="hover:text-white">All Brands</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/store-category" className="hover:text-white">Store & Category</Link></li>
                <li><Link href="/sitemap" className="hover:text-white">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">Special Event</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/deals/black-friday" className="hover:text-white">Black Friday Deals</Link></li>
                <li><Link href="/deals/christmas" className="hover:text-white">Christmas Deals</Link></li>
                <li><Link href="/deals/cyber-monday" className="hover:text-white">Cyber Monday Deals</Link></li>
                <li><Link href="/deals/halloween" className="hover:text-white">Halloween Deals</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 bg-gradient-to-r from-blue-700 to-red-600 px-4 py-4">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-white/90">
              © {new Date().getFullYear()} SavingsHub4u. All Rights Reserved.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30" aria-label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.919-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.919.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30" aria-label="Pinterest">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.124 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.377 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
