"use client";

import { createContext, useContext, useMemo } from "react";
import type { BlogPost } from "@/data/blog";
import type { NavDropdownPost } from "@/data/blog";

export type BlogDataContextValue = {
  heroPost: BlogPost;
  featuredPosts: BlogPost[];
  mostPopularPosts: BlogPost[];
  latestPosts: BlogPost[];
  trendingPosts: BlogPost[];
  footerCategories: { name: string; posts: BlogPost[] }[];
  navDropdownPosts: Record<string, NavDropdownPost[]>;
};

const BlogDataContext = createContext<BlogDataContextValue | null>(null);

export function useBlogData(): BlogDataContextValue {
  const value = useContext(BlogDataContext);
  if (!value) {
    throw new Error("useBlogData must be used within BlogDataProvider");
  }
  return value;
}

export function BlogDataProvider({
  initialData,
  children,
}: {
  initialData: BlogDataContextValue;
  children: React.ReactNode;
}) {
  const value = useMemo(() => initialData, [initialData]);
  return (
    <BlogDataContext.Provider value={value}>
      {children}
    </BlogDataContext.Provider>
  );
}
