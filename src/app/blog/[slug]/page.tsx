import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  heroPost,
  featuredPosts,
  mostPopularPosts,
  latestPosts,
} from "@/data/blog";

type Props = { params: Promise<{ slug: string }> };

const allPosts = [
  heroPost,
  ...featuredPosts,
  ...mostPopularPosts,
  ...latestPosts,
];

function getPost(slug: string) {
  return allPosts.find((p) => p.slug === slug);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-red-600 hover:underline"
        >
          ← Back to Home
        </Link>
        <article>
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wide text-red-600">
            {post.category}
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            {post.title}
          </h1>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
          <div className="prose prose-zinc mt-8 max-w-none">
            <p className="text-lg text-zinc-600">{post.excerpt}</p>
            <p className="mt-4 text-zinc-700">
              Full article content will be loaded from CMS or markdown. This is a
              placeholder for savingshub4u.com blog posts.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  const slugs = [...new Set(allPosts.map((p) => p.slug))];
  return slugs.map((slug) => ({ slug }));
}
