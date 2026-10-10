import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono, Hind_Siliguri } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ToastProvider } from "@/components/ToastProvider";
import { getCategories, getProducts } from "@/lib/api";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজারের দাম",
  description: "নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজার দর এক নজরে।",
};

export const instant = false;

async function HeaderData() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  return <SiteHeader categories={categories} products={products} />;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${geistMono.variable}`}>
      <body>
        <Suspense fallback={<div className="header-fallback" aria-hidden="true" />}>
          <HeaderData />
        </Suspense>
        <main className="page-content">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
