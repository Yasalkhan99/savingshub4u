"use client";

import { useEffect } from "react";

export default function ScrollToSearchResults({ searchQuery }: { searchQuery: string }) {
  useEffect(() => {
    if (!searchQuery?.trim()) return;
    const t = setTimeout(() => {
      const el = document.getElementById("search-results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(t);
  }, [searchQuery]);
  return null;
}
