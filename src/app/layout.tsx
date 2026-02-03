import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getBlogData } from "@/lib/blog";
import { BlogDataProvider } from "@/components/BlogDataProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SavingsHub4u – Deals, Coupons & Savings Blog",
  description:
    "SavingsHub4u.com – Your go-to blog for the best deals, coupons, reviews, and money-saving tips. News, lifestyle, beauty & more.",
  metadataBase: new URL("https://savingshub4u.com"),
  openGraph: {
    title: "SavingsHub4u – Deals, Coupons & Savings Blog",
    description: "Best deals, coupons, reviews and savings tips.",
    url: "https://savingshub4u.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const blogData = await getBlogData();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BlogDataProvider
          initialData={{
            heroPost: blogData.heroPost,
            featuredPosts: blogData.featuredPosts,
            mostPopularPosts: blogData.mostPopularPosts,
            latestPosts: blogData.latestPosts,
            trendingPosts: blogData.trendingPosts,
            footerCategories: blogData.footerCategories,
            navDropdownPosts: blogData.navDropdownPosts,
          }}
        >
          {children}
        </BlogDataProvider>
      </body>
    </html>
  );
}
