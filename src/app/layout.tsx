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
  title: {
    default: "SavingsHub4u – Your Gateway to Smart Savings & Best Coupons",
    template: "%s | SavingsHub4u",
  },
  description:
    "Save smarter with SavingsHub4u. Verified coupon codes, exclusive deals, and money-saving tips from top brands. Your personal savings partner for online shopping.",
  keywords: ["coupons", "deals", "promo codes", "savings", "discounts", "SavingsHub4u"],
  metadataBase: new URL("https://savingshub4u.com"),
  icons: {
    icon: "/Logo%20Icon.png",
    apple: "/Logo%20Icon.png",
  },
  openGraph: {
    title: "SavingsHub4u – Your Gateway to Smart Savings & Best Coupons",
    description: "Save smarter with verified coupon codes and exclusive deals from top brands. Your personal savings partner.",
    url: "https://savingshub4u.com",
    siteName: "SavingsHub4u",
  },
  twitter: {
    card: "summary_large_image",
    title: "SavingsHub4u – Smart Savings & Best Coupons",
    description: "Verified coupon codes, exclusive deals & money-saving tips. Your personal savings partner.",
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
