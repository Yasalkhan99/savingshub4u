import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import Footer from "@/components/Footer";
import {
  mostPopularPosts,
  latestPosts,
} from "@/data/blog";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main>
        <Header transparent />
        {/* Hero has -mt so it sits under the navbar; transparent nav then shows hero behind it */}
        <Hero />
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1">
              {/* Most Popular Articles */}
              <section className="mb-12">
                <h2 className="mb-6 border-b-2 border-red-600 pb-2 text-xl font-bold uppercase tracking-wide text-zinc-900">
                  MOST POPULAR ARTICLES
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {mostPopularPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
              {/* Separator bar */}
              <div className="my-10 h-1 w-full rounded bg-zinc-800/90" />
              {/* Latest Articles */}
              <section>
                <h2 className="mb-6 border-b-2 border-red-600 pb-2 text-xl font-bold uppercase tracking-wide text-zinc-900">
                  LATEST ARTICLES
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {latestPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            </div>
            <TrendingSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
