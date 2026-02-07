"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const DEBOUNCE_MS = 300;

export default function PromotionsHeroSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const applySearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const url = trimmed ? `/promotions?q=${encodeURIComponent(trimmed)}` : "/promotions";
      router.replace(url);
    },
    [router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      applySearch(value);
    }, DEBOUNCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    applySearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white shadow-md transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
      <span className="flex items-center pl-5 text-zinc-400" aria-hidden>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="search"
        name="q"
        value={query}
        onChange={handleChange}
        placeholder="Find coupon or store..."
        className="min-w-0 flex-1 bg-transparent py-4 pl-3 pr-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none sm:py-5 sm:pl-4 sm:text-lg"
        autoComplete="off"
      />
      <button
        type="submit"
        className="shrink-0 bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 sm:px-8"
      >
        Search
      </button>
    </form>
  );
}
