"use client";

export default function CategoriesSidebar() {
  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-72">
      {/* Search Brands */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <label htmlFor="categories-search" className="sr-only">
          Search Brands
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="categories-search"
            type="search"
            placeholder="Search Brands"
            className="w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <span className="shrink-0 text-emerald-600" aria-hidden>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <p className="text-sm font-medium text-emerald-800">
          Disclaimer: We may earn commission on the purchases made via affiliate link.
        </p>
      </div>

      {/* Newsletter */}
      <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-zinc-900">Subscribe To Our Weekly Newsletter!</h2>
        <div className="space-y-3">
          <label htmlFor="categories-newsletter-email" className="sr-only">
            Enter your email
          </label>
          <input
            id="categories-newsletter-email"
            type="email"
            placeholder="Enter Your Email"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-teal-700"
          >
            Subscribe
          </button>
        </div>
      </div>
    </aside>
  );
}
