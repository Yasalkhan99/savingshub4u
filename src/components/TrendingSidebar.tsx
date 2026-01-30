import Image from "next/image";
import Link from "next/link";
import { trendingPosts } from "@/data/blog";

export default function TrendingSidebar() {
  return (
    <aside className="sticky top-20 w-full shrink-0 self-start lg:w-72">
      <h3 className="mb-4 border-b-2 border-red-600 pb-2 text-lg font-bold uppercase tracking-wide text-zinc-900">
        TRENDING
      </h3>
      <ul className="space-y-4">
        {trendingPosts.map((post, index) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex gap-3 hover:opacity-90"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="80px"
                />
              </div>
              <span className="line-clamp-2 flex-1 text-sm font-medium text-zinc-800 group-hover:underline">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
