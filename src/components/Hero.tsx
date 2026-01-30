import Image from "next/image";
import Link from "next/link";
import { heroPost, featuredPosts } from "@/data/blog";

export default function Hero() {
  return (
    <section className="relative -mt-14 w-full bg-zinc-900">
      {/* Full-width dark background image - taller hero (extends under navbar so transparent nav shows hero) */}
      <div className="relative h-[78vh] w-full overflow-hidden min-h-[420px] max-h-[620px] md:min-h-[460px] md:max-h-[680px]">
        <Image
          src={heroPost.image}
          alt={heroPost.title}
          fill
          className="object-cover object-center brightness-[0.85]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        {/* Centered white headline on the image (screenshot style) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <Link href={`/blog/${heroPost.slug}`} className="block group">
            <h1 className="max-w-4xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl group-hover:underline">
              {heroPost.title}
            </h1>
          </Link>
        </div>
      </div>
      {/* White box below headline - 3 sections, slightly overlaps content below (screenshot) */}
      <div className="relative z-10 mx-4 -mt-8 max-w-5xl rounded-none bg-zinc-50 shadow-xl md:mx-8 md:-mt-12 lg:mx-auto lg:max-w-6xl xl:mx-auto xl:px-4">
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-4 border-b border-zinc-200 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:border-zinc-200 sm:last:border-r-0 md:p-5 lg:p-6"
            >
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded bg-zinc-100 md:h-24 md:w-28">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="112px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-red-600 md:text-xs">
                  {post.category}
                </span>
                <span className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-800 group-hover:underline md:text-base">
                  {post.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
