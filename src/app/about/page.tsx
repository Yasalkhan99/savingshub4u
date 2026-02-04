import Link from "next/link";
import Image from "next/image";
import PromotionsHeader from "@/components/PromotionsHeader";
import { getStores } from "@/lib/stores";
import { getBlogData } from "@/lib/blog";

const VALUES = [
  {
    title: "Honest Savings",
    description:
      "Every code is verified by humans before it goes live. If it is not useful, it does not make the cut.",
  },
  {
    title: "Community First",
    description:
      "Shoppers, bloggers, and brands tell us what to feature. We build with feedback loops, not a walled garden.",
  },
  {
    title: "Learning Everyday",
    description:
      "Deals move fast. We constantly analyze performance data to highlight the offers that really convert.",
  },
];

const TIMELINE = [
  { year: "2023", text: "SavingsHub4u launched with a hand curated list of 100 stores." },
  { year: "2024", text: "Added admin portal, analytics, and our community driven coupon submit form." },
  { year: "2025", text: "Partnered with premium networks and crossed 500 featured merchants." },
  { year: "Today", text: "Serving shoppers globally with transparent offers and editorial storytelling." },
];

const TEAM = [
  {
    name: "Rida Khan",
    role: "Founder & Editorial Lead",
    bio: "Keeps the brand voice consistent, reviews stories, and makes sure every article is genuinely useful.",
  },
  {
    name: "Bilal Qureshi",
    role: "Partnerships",
    bio: "Talks to affiliates, onboard brands, and negotiates exclusive savings for the community.",
  },
  {
    name: "Fatima Ahmed",
    role: "Product & UX",
    bio: "Designs the experience, prototypes new flows, and obsesses over making deals easy to discover.",
  },
];

export default async function AboutPage() {
  const stores = await getStores();
  const { featuredPosts, latestPosts } = await getBlogData();
  const totalStores = stores.length;
  const trustedCoupons = stores.filter((s) => s.couponCode || s.couponTitle).length;
  const latestInsights = latestPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <PromotionsHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-zinc-700">
                SavingsHub4u
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-zinc-900 font-medium">About Us</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="mb-12 flex flex-col gap-8 rounded-3xl border border-zinc-200 bg-gradient-to-br from-rose-50 via-white to-blue-50/70 p-8 shadow-sm lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
              Our Story
            </p>
            <h1 className="mb-4 text-3xl font-bold text-zinc-900 sm:text-4xl">
              Built for shoppers who want real deals, not endless popups.
            </h1>
            <p className="mb-6 text-base leading-relaxed text-zinc-600">
              SavingsHub4u started as a Google sheet shared between friends. Today it’s a living platform where
              every verified coupon, blog story, and brand partnership helps people save smarter. We obsess over
              quality, storytelling, and transparency so you can trust what you click.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/promotions/share-a-coupon"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Share A Coupon
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
              >
                Talk With Us
              </Link>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="relative h-64 w-full max-w-sm">
              <Image
                src="https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80"
                alt="Team collaborating"
                fill
                className="rounded-3xl object-cover shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-12 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Stores Onboarded</p>
            <p className="text-3xl font-bold text-zinc-900">{totalStores.toLocaleString()}</p>
            <p className="mt-1 text-sm text-zinc-500">Curated merchants with verified offers</p>
          </article>
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Trusted Coupons</p>
            <p className="text-3xl font-bold text-zinc-900">{trustedCoupons.toLocaleString()}</p>
            <p className="mt-1 text-sm text-zinc-500">Hand-tested codes, monitored daily</p>
          </article>
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Editorial Stories</p>
            <p className="text-3xl font-bold text-zinc-900">{featuredPosts.length}</p>
            <p className="mt-1 text-sm text-zinc-500">Featured articles every week</p>
          </article>
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Clicks Tracked</p>
            <p className="text-3xl font-bold text-zinc-900">2.4M+</p>
            <p className="mt-1 text-sm text-zinc-500">Shoppers sent to partner stores</p>
          </article>
        </section>

        {/* Values */}
        <section className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900">What keeps us moving</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.title} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-5">
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">{value.title}</h3>
                <p className="text-sm text-zinc-600">{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900">From spreadsheet to platform</h2>
          <ol className="relative border-l border-zinc-200 pl-6">
            {TIMELINE.map((item, index) => (
              <li key={item.year} className="mb-6 last:mb-0">
                <span className="absolute -left-2 mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-zinc-900">{item.year}</p>
                <p className="text-sm text-zinc-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Team */}
        <section className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900">People behind the scenes</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <article key={member.name} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
                    {member.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-zinc-900">{member.name}</p>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-600">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Latest insights */}
        <section className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900">Fresh from the savings blog</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {latestInsights.map((post) => (
              <article key={post.id} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{post.category}</p>
                <h3
                  className="mt-2 line-clamp-2 text-sm font-bold text-zinc-900 [&_a]:text-zinc-900"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-500"
                >
                  Read story →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-zinc-900 bg-zinc-900 px-6 py-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">Let’s Collaborate</p>
              <h2 className="mt-3 text-2xl font-bold">Want to feature your brand or share a story?</h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-300">
                We partner with commerce teams, bloggers, and agencies to surface exclusive offers. Tell us what you
                are planning and we’ll build something smart together.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Contact Team
              </Link>
              <Link
                href="/promotions/share-a-coupon"
                className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Submit Offer
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200 bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Favorite Categories
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link href="/promotions" className="hover:text-white">Promotions</Link></li>
                <li><Link href="/promotions/share-a-coupon" className="hover:text-white">Share A Coupon</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Important Links
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/promotions/share-a-coupon" className="hover:text-white">Share A Coupon</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Events
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/deals/black-friday" className="hover:text-white">Black Friday Coupons/Deals</Link></li>
                <li><Link href="/deals/christmas" className="hover:text-white">Christmas Coupons/Deals</Link></li>
                <li><Link href="/deals/cyber-monday" className="hover:text-white">Cyber Monday Coupons/Deals</Link></li>
                <li><Link href="/deals/halloween" className="hover:text-white">Halloween Coupons/Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-300">
                Connect With Us
              </h4>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="Facebook">FB</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="Instagram">IG</a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="Pinterest">Pin</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white" aria-label="YouTube">YT</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
          <div className="mx-auto max-w-6xl text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} SavingsHub4u. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
