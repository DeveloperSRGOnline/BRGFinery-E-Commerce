"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageItem {
  url: string;
  publicId?: string;
}

interface ProductImageGalleryProps {
  images: ImageItem[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
  ];
  
  // Extract database images
  const dbImages = images?.map((img) => img.url).filter(Boolean) || [];

  // Always ensure at least 4 unique images exist in gallery
  const galleryImages: string[] = Array.from(new Set([...dbImages, ...fallbackImages])).slice(0, 5);

  const [selectedImage, setSelectedImage] = useState<string>(galleryImages[0]);
  const [zoomStyle, setZoomStyle] = useState({
    opacity: 0,
    backgroundPosition: "0% 0%",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      opacity: 1,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container with Interactive Zoom lens hover */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[4/3] bg-brand-bg-light rounded-3xl overflow-hidden border border-brand-accent/15 shadow-md cursor-crosshair group select-none"
      >
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />

        {/* E-commerce High-Definition Magnifier Zoom Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out z-20"
          style={{
            opacity: zoomStyle.opacity,
            backgroundImage: `url(${selectedImage})`,
            backgroundSize: "220%",
            backgroundPosition: zoomStyle.backgroundPosition,
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Hover Hint Badge */}
        <div className="absolute bottom-4 right-4 z-30 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
          Hover to zoom 🔍
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-2 w-full">
        {galleryImages.map((url, i) => {
          const isSelected = selectedImage === url;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImage(url)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-xs cursor-pointer ${
                isSelected
                  ? "border-brand-dark ring-2 ring-brand-dark/40 opacity-100"
                  : "border-brand-accent/20 hover:border-brand-dark/60 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-brand-dark/10 pointer-events-none rounded-2xl" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
