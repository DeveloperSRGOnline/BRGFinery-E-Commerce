"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Heart, ArrowLeftRight, Eye, X, ShoppingBag, Star, Check } from "lucide-react";

export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number; // in paise or rupees
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  ratingAvg: number;
  ratingCount: number;
  images: { url: string; publicId?: string }[];
  categoryId?: { name: string; slug: string } | string;
}

interface TrendProductCardProps {
  product: ProductType;
}

export default function TrendProductCard({ product }: TrendProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Price calculations
  const isPaise = product.price > 5000 && !product.originalPrice;
  const currentPrice = isPaise ? product.price / 100 : product.price;

  const originalPrice = product.originalPrice 
    ? (product.originalPrice > 5000 && isPaise ? product.originalPrice / 100 : product.originalPrice)
    : Math.round(currentPrice * 1.35);

  const discount = product.discountPercentage 
    ? product.discountPercentage 
    : Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  const categoryName = typeof product.categoryId === "object" ? product.categoryId?.name : "Finery";
  const imageUrl = product.images?.[0]?.url || "/hero.png";

  return (
    <>
      <div className="relative group bg-white rounded-3xl p-4 shadow-lg border border-black/5 hover:shadow-2xl transition-all duration-500 flex flex-col h-[460px] w-[310px] sm:w-[330px] shrink-0 select-none">
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-6 right-6 z-10 bg-amber-400 text-black text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
            {discount}% OFF
          </div>
        )}

        {/* Visual & Left Action Buttons Container */}
        <div className="relative w-full h-[250px] rounded-2xl overflow-hidden bg-[#f4ece1] flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="330px"
          />

          {/* Action overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Left Vertical Action Buttons */}
          <div className="absolute left-3 top-3 flex flex-col gap-2.5 z-20">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 shadow-md ${
                isWishlisted
                  ? "bg-rose-500 text-white border-rose-400 scale-110"
                  : "bg-white/80 hover:bg-white text-zinc-700 hover:text-rose-500 border-white/60 hover:scale-105"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
            </button>

            {/* Compare Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCompared(!isCompared);
              }}
              title={isCompared ? "Remove from compare" : "Compare product"}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 shadow-md ${
                isCompared
                  ? "bg-emerald-600 text-white border-emerald-500 scale-110"
                  : "bg-white/80 hover:bg-white text-zinc-700 hover:text-emerald-600 border-white/60 hover:scale-105"
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            {/* Quick View Modal Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              title="Quick view"
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-zinc-700 hover:text-brand-accent backdrop-blur-md border border-white/60 flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Details Content */}
        <div className="mt-4 flex flex-col flex-1 justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-accent-subtle bg-brand-accent/10 px-2 py-0.5 rounded-md">
                {categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-mono font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.ratingAvg ? product.ratingAvg.toFixed(1) : "4.8"}</span>
                <span className="text-zinc-400 text-[10px]">({product.ratingCount || 24})</span>
              </div>
            </div>

            <h3 className="text-zinc-900 font-serif font-bold text-lg leading-snug line-clamp-1 group-hover:text-brand-accent transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Pricing */}
          <div className="my-2 flex items-baseline gap-2.5">
            <span className="text-xl font-bold font-serif text-zinc-900">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-mono text-zinc-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Select Option / View Detail Button */}
          <Link
            href={`/shop/${product.slug}`}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-dark hover:bg-brand-dark-hover text-brand-bg font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Select Option</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>

      {/* Quick View Full Screen Portal Overlay (Big Modal) */}
      {isQuickViewOpen && typeof window !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsQuickViewOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl relative border border-black/10 overflow-hidden flex flex-col md:flex-row gap-8 animate-in zoom-in-95 duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prominent Cross Button to close Modal */}
            <button
              onClick={() => setIsQuickViewOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-zinc-100 hover:bg-rose-500 hover:text-white text-zinc-700 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Quick View Large Image */}
            <div className="relative w-full md:w-1/2 h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-[#f4ece1] shrink-0 shadow-inner">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-amber-400 text-black text-xs font-mono font-extrabold px-3 py-1.5 rounded-full uppercase shadow-md">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Quick View Details */}
            <div className="flex flex-col justify-between flex-1 space-y-5 py-2">
              <div>
                <div className="flex items-center justify-between pr-8 mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-accent font-bold bg-brand-accent/10 px-3 py-1 rounded-md">
                    {categoryName}
                  </span>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock})
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 leading-tight">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-600 font-mono font-bold">
                    {product.ratingAvg ? product.ratingAvg.toFixed(1) : "4.8"}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    ({product.ratingCount || 24} customer reviews)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 font-sans mt-4 leading-relaxed border-t border-b border-zinc-100 py-3">
                  {product.description || "Crafted with premium materials and signature design. Designed to deliver superior comfort, durability and luxury style for any modern wardrobe."}
                </p>
              </div>

              <div>
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-bold font-serif text-zinc-900">
                    ₹{currentPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-lg font-mono text-zinc-400 line-through">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Save ₹{(originalPrice - currentPrice).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Direct Link button */}
                <Link
                  href={`/shop/${product.slug}`}
                  onClick={() => setIsQuickViewOpen(false)}
                  className="w-full py-4 px-6 rounded-2xl bg-brand-dark hover:bg-brand-dark-hover text-brand-bg font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Product Details & Buy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
