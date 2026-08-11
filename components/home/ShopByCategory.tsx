"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  itemCount?: number;
  image?: string;
  tagline?: string;
}

interface ShopByCategoryProps {
  categories: CategoryItem[];
}

export default function ShopByCategory({ categories }: ShopByCategoryProps) {
  // Rich default luxury categories matching BRG Finery design aesthetic
  const defaultCategories: CategoryItem[] = [
    {
      _id: "c1",
      name: "Luxury Apparel",
      slug: "fashion",
      itemCount: 48,
      image: "/hero_fashion.jpg",
      tagline: "Heavyweight Cotton & Velvet Finery",
    },
    {
      _id: "c2",
      name: "Signature Headwear",
      slug: "electronics",
      itemCount: 24,
      image: "/hero.png",
      tagline: "Handwoven Straw & Embroidered Visors",
    },
    {
      _id: "c3",
      name: "Exclusive Accessories",
      slug: "personal-care",
      itemCount: 32,
      image: "/hero_light_fashion.jpg",
      tagline: "Italian Leather Pouches & Accessories",
    },
    {
      _id: "c4",
      name: "Living & Essentials",
      slug: "home-kitchen",
      itemCount: 19,
      image: "/hero_fashion.jpg",
      tagline: "Bespoke Lifestyle & Living Artifacts",
    },
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono font-bold tracking-widest uppercase">
            <span>🏛️</span> CURATED ESSENTIALS
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-brand-heading tracking-tight uppercase">
            SHOP BY CATEGORY
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-brand-accent hover:text-brand-accent-hover transition-colors group border-b-2 border-brand-accent/30 pb-1 self-start md:self-end"
        >
          <span>Explore All Collections</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Asymmetric Luxury Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {categoryList.slice(0, 4).map((category, idx) => {
          // Asymmetric column span for premium editorial layout
          const colSpan = idx === 0 || idx === 3 ? "md:col-span-7" : "md:col-span-5";
          const bgImage = category.image || (idx % 2 === 0 ? "/hero_fashion.jpg" : "/hero_light_fashion.jpg");

          return (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className={`group relative rounded-3xl overflow-hidden h-[340px] sm:h-[400px] border border-white/40 shadow-xl flex flex-col justify-end p-8 sm:p-10 transition-all duration-500 hover:shadow-2xl hover:border-brand-accent/50 ${colSpan}`}
            >
              {/* Background Image */}
              <Image
                src={bgImage}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Multi-layered Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500" />

              {/* Item Count Pill Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                  {category.itemCount || 24}+ Items
                </span>
              </div>

              {/* Top Right Floating Arrow Icon */}
              <div className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-lg">
                <ArrowUpRight className="w-5 h-5" />
              </div>

              {/* Category Info Bottom Overlay */}
              <div className="relative z-10 space-y-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-amber-300 block">
                  {category.tagline || "Curated Signature Finery"}
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight uppercase tracking-tight">
                  {category.name}
                </h3>

                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="uppercase tracking-widest font-bold border-b border-amber-300 text-amber-300">Discover Collection</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
