import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { stripHtml } from "@/lib/slugify";

type ArticleCardProps = {
  post: BlogPost;
};

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          alt={stripHtml(post.title)}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-600">
          {post.category}
        </span>
        <Link href={`/blog/${post.slug}`} className="mb-2 flex-1">
          <h2 className="text-lg font-bold leading-snug text-zinc-900 line-clamp-2 group-hover:underline [&_a]:text-red-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: post.title }} />
        </Link>
        <div className="blog-content mb-4 line-clamp-2 text-sm text-zinc-600" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex w-fit items-center text-sm font-semibold text-red-600 hover:underline"
        >
          READ MORE
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
