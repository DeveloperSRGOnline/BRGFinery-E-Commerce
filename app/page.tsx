import Link from "next/link";
import { connectToDB } from "@/lib/db/connect";
import Category from "@/models/Category.model";
import Product from "@/models/Product.model";
import Navbar from "@/components/ui/Navbar";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrendCarousel from "@/components/home/TrendCarousel";
import ShopByCategory from "@/components/home/ShopByCategory";
import MonsoonSaleBanner from "@/components/home/MonsoonSaleBanner";
import SubscribeSection from "@/components/home/SubscribeSection";
import Footer from "@/components/ui/Footer";

async function getFeaturedData() {
  await connectToDB();
  const [categories, featuredProducts] = await Promise.all([
    Category.find({}).sort({ name: 1 }).limit(6).lean(),
    Product.find({ isActive: true })
      .sort({ ratingCount: -1 })
      .limit(8)
      .populate("categoryId", "name slug")
      .lean(),
  ]);
  return { categories, featuredProducts };
}

export const metadata = {
  title: "BRG Finery — Luxury Apparel & Signature Finery",
  description: "U R AWESOME. Experience refined black & gold luxury apparel, crafted signature pieces, and premium lifestyle essentials.",
};

export default async function HomePage() {
  const { categories, featuredProducts } = await getFeaturedData();

  // Convert mongoose lean objects for trend products
  const formattedProducts = featuredProducts.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    stock: p.stock,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    images: p.images || [],
    categoryId: p.categoryId,
  }));

  // Formatted categories for ShopByCategory component
  const formattedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    itemCount: 24,
  }));

  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading selection:bg-[#7d4000] selection:text-white relative overflow-x-hidden">
      <Navbar />

      {/* 1. Hero Section with Auto Image Carousel */}
      <section className="relative pt-2 pb-8 sm:pt-4 sm:pb-10 max-w-7xl mx-auto px-6 sm:px-8">
        <HeroCarousel />
      </section>

      {/* 2. Explore The Trend Section - Real Curved Physics Rotating Carousel */}
      <TrendCarousel products={formattedProducts} />

      {/* 3. Shop By Category Section */}
      <ShopByCategory categories={formattedCategories} />

      {/* 4. Monsoon Sale Banner Section */}
      <MonsoonSaleBanner />

      {/* 5. Subscribe to Latest Trend Updates Section */}
      <SubscribeSection />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}