"use client";

import Image from "next/image";
import Link from "next/link";
import { useBlogData } from "@/components/BlogDataProvider";
import { stripHtml } from "@/lib/slugify";

export default function Footer() {
  const { footerCategories } = useBlogData();
  return (
    <footer className="mt-12 bg-zinc-900 text-white">
      {/* Main footer columns - dark grey/black */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerCategories.map((column) => (
            <div key={column.name}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
                {column.name}
              </h4>
              <ul className="space-y-3">
                {column.posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-zinc-800">
                        <Image
                          src={post.image}
                          alt={stripHtml(post.title)}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <span className="line-clamp-2 flex-1 [&_a]:text-zinc-300 [&_a]:hover:text-white" dangerouslySetInnerHTML={{ __html: post.title }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom bar - red line on TOP, copyright (screenshot) */}
      <div className="border-t-2 border-red-600 bg-black/80 py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} SavingsHub4u.com. All rights reserved.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-400">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
