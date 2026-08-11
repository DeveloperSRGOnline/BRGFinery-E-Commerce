"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrendProductCard, { ProductType } from "./TrendProductCard";

interface TrendCarouselProps {
  products: ProductType[];
}

export default function TrendCarousel({ products }: TrendCarouselProps) {
  // Base product items
  const baseProducts: ProductType[] = products.length > 0 ? products : [
    {
      _id: "t1",
      name: "Noir Velvet Signature Hoodie",
      slug: "noir-velvet-hoodie",
      price: 249000,
      originalPrice: 389000,
      discountPercentage: 36,
      stock: 12,
      ratingAvg: 4.9,
      ratingCount: 42,
      images: [{ url: "/hero_fashion.jpg" }],
      categoryId: { name: "Hoodies", slug: "fashion" },
      description: "Signature heavyweight cotton velvet hoodie with gold detail trim.",
    },
    {
      _id: "t2",
      name: "Sienna Straw Sun Visor Cap",
      slug: "sienna-straw-visor",
      price: 185000,
      originalPrice: 265000,
      discountPercentage: 30,
      stock: 8,
      ratingAvg: 4.8,
      ratingCount: 19,
      images: [{ url: "/hero.png" }],
      categoryId: { name: "Headwear", slug: "fashion" },
      description: "Handwoven luxury sienna straw visor cap for sunny escapes.",
    },
    {
      _id: "t3",
      name: "Elara Oversized Graphic Tee",
      slug: "elara-graphic-tee",
      price: 149000,
      originalPrice: 220000,
      discountPercentage: 32,
      stock: 15,
      ratingAvg: 4.7,
      ratingCount: 38,
      images: [{ url: "/hero_light_fashion.jpg" }],
      categoryId: { name: "T-Shirts", slug: "fashion" },
      description: "100% organic heavy jersey cotton graphic tee with minimalist typography.",
    },
    {
      _id: "t4",
      name: "Nova Ribbed Knit Beanie",
      slug: "nova-ribbed-beanie",
      price: 129000,
      originalPrice: 189000,
      discountPercentage: 31,
      stock: 5,
      ratingAvg: 4.9,
      ratingCount: 56,
      images: [{ url: "/hero_fashion.jpg" }],
      categoryId: { name: "Headwear", slug: "fashion" },
      description: "Soft merino wool blend beanie designed for autumn distinction.",
    },
    {
      _id: "t5",
      name: "Aura Leather Crossbody Pouch",
      slug: "aura-leather-pouch",
      price: 349000,
      originalPrice: 499000,
      discountPercentage: 30,
      stock: 4,
      ratingAvg: 5.0,
      ratingCount: 14,
      images: [{ url: "/hero.png" }],
      categoryId: { name: "Accessories", slug: "fashion" },
      description: "Full-grain Italian leather crossbody pouch with brass hardware.",
    },
    {
      _id: "t6",
      name: "Noir Visor Classic Cap",
      slug: "noir-visor-classic",
      price: 289000,
      originalPrice: 399000,
      discountPercentage: 27,
      stock: 9,
      ratingAvg: 4.6,
      ratingCount: 22,
      images: [{ url: "/hero_light_fashion.jpg" }],
      categoryId: { name: "Headwear", slug: "fashion" },
      description: "Structured deep black cotton visor cap with signature gold embroidery.",
    },
  ];

  // Quadruple items to create a vast continuous buffer track
  const items = [...baseProducts, ...baseProducts, ...baseProducts, ...baseProducts];
  const cardWidth = 350; // card spacing
  const singleLoopWidth = baseProducts.length * cardWidth;

  // Track position offset initialized in middle section
  const [offset, setOffset] = useState(-singleLoopWidth);
  const offsetRef = useRef(-singleLoopWidth);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Physics animation loop with Teleport boundary normalization (NO popping or glitching)
  useEffect(() => {
    let lastTimestamp = performance.now();

    const updatePhysics = (now: number) => {
      const delta = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      if (!isDraggingRef.current) {
        // Friction decay
        velocityRef.current *= Math.pow(0.88, delta * 60);

        if (Math.abs(velocityRef.current) > 2) {
          offsetRef.current += velocityRef.current * delta;
        } else if (velocityRef.current !== 0) {
          // Snap cleanly to nearest card slot
          const snapped = Math.round(offsetRef.current / cardWidth) * cardWidth;
          offsetRef.current = snapped;
          velocityRef.current = 0;
        }
      }

      // Seamless Teleport boundary normalization:
      // Keep offsetRef within [-2 * singleLoopWidth, -singleLoopWidth]
      while (offsetRef.current > -singleLoopWidth / 2) {
        offsetRef.current -= singleLoopWidth;
      }
      while (offsetRef.current < -singleLoopWidth * 2.5) {
        offsetRef.current += singleLoopWidth;
      }

      setOffset(offsetRef.current);
      animFrameIdRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [singleLoopWidth, cardWidth]);

  // Arrow button click with smooth spring physics
  const handleArrowClick = (direction: "left" | "right") => {
    const step = direction === "right" ? -cardWidth : cardWidth;
    const currentOff = offsetRef.current;
    const targetOffset = Math.round((currentOff + step) / cardWidth) * cardWidth;
    const impulse = targetOffset - currentOff;

    velocityRef.current = impulse * 3;

    let startOff = offsetRef.current;
    let startTime: number | null = null;
    const duration = 550;

    const stepAnimation = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Elastic overshoot momentum
      const easeOvershoot = 1 + Math.sin(progress * Math.PI * 1.2) * 0.1 * (1 - progress);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const current = startOff + impulse * (easeOutCubic * 0.9 + easeOvershoot * 0.1);
      offsetRef.current = current;

      if (progress < 1) {
        requestAnimationFrame(stepAnimation);
      } else {
        offsetRef.current = targetOffset;
        velocityRef.current = 0;
      }
    };

    requestAnimationFrame(stepAnimation);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - lastXRef.current;
    const now = performance.now();
    const dt = Math.max((now - lastTimeRef.current) / 1000, 0.001);

    velocityRef.current = deltaX / dt;
    offsetRef.current += deltaX;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastXRef.current = e.touches[0].clientX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const clientX = e.touches[0].clientX;
    const deltaX = clientX - lastXRef.current;
    const now = performance.now();
    const dt = Math.max((now - lastTimeRef.current) / 1000, 0.001);

    velocityRef.current = deltaX / dt;
    offsetRef.current += deltaX;

    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Active Index calculation for bottom indicators
  const normalizedPos = ((-offset % singleLoopWidth) + singleLoopWidth) % singleLoopWidth;
  const activeIndex = Math.round(normalizedPos / cardWidth) % baseProducts.length;

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden select-none bg-gradient-to-b from-transparent via-[#dcd0c0]/40 to-transparent">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono font-bold tracking-widest uppercase">
          <span>✨</span> EXPLORE THE TREND
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-brand-heading tracking-tight uppercase">
          BROWSE THE BEST SELLING PRODUCTS
        </h2>
        <p className="text-sm sm:text-base font-sans text-brand-accent-subtle max-w-xl mx-auto leading-relaxed">
          Discover curations crafted for distinction. Enjoy seamless infinite curved scrolling.
        </p>
      </div>

      {/* Curved Physics Track Container */}
      <div 
        className="relative w-full h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {items.map((product, index) => {
            // Absolute position of card in track
            const xPos = index * cardWidth + offset;

            // Render only cards that are visible in layout viewport range
            if (xPos < -800 || xPos > 800) return null;

            // Curved Arc Transformations
            const normalizedX = xPos / 550; // distance from center
            const distFromCenter = Math.abs(normalizedX);

            // 1. Gentle vertical arc drop (Y-axis curve drop)
            const translateY = Math.pow(distFromCenter, 2) * 35;

            // 2. Outward 3D tilt rotation
            const rotateZ = normalizedX * -4.5;
            const rotateY = normalizedX * 12;

            // 3. Scale and depth sorting
            const scale = Math.max(0.82, 1 - distFromCenter * 0.12);
            const opacity = Math.max(0.25, 1 - distFromCenter * 0.35);
            const zIndex = Math.round(100 - distFromCenter * 50);

            return (
              <div
                key={`${product._id}-${index}`}
                className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-75 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${xPos}px, ${translateY}px, 0px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  pointerEvents: distFromCenter < 1.2 ? "auto" : "none",
                }}
              >
                <TrendProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Curved Carousel Bottom Control Bar & Arrow Buttons */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 mt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => handleArrowClick("left")}
          aria-label="Previous Trend Product"
          className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-brand-dark border-2 border-brand-accent/20 shadow-xl flex items-center justify-center hover:scale-110 hover:border-brand-accent active:scale-95 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 text-brand-heading group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {baseProducts.map((_, i) => {
            const isCenter = i === activeIndex;

            return (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isCenter
                    ? "w-8 bg-brand-dark shadow-sm"
                    : "w-2.5 bg-brand-dark/20"
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={() => handleArrowClick("right")}
          aria-label="Next Trend Product"
          className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-brand-dark border-2 border-brand-accent/20 shadow-xl flex items-center justify-center hover:scale-110 hover:border-brand-accent active:scale-95 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 text-brand-heading group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </section>
  );
}
