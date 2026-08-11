"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/hero.png",
    subtitle: "WHERE TRADITION MEETS TREND",
    title: "THE ART OF EFFORTLESS FASHION",
    description: "From City Streets To Summer Escapes, Our Bestsellers Blend Comfort With Effortless Charm.",
    buttonText: "Shop Bestsellers",
    link: "/shop",
  },
  {
    image: "/hero_fashion.jpg",
    subtitle: "AUTUMN / WINTER FINERY",
    title: "CRAFTED FOR DISTINCTION",
    description: "Discover handcrafted luxury apparel designed to elevate your everyday elegance.",
    buttonText: "Explore Collection",
    link: "/shop?sort=new",
  },
  {
    image: "/hero_light_fashion.jpg",
    subtitle: "EXCLUSIVE SIGNATURE PIECES",
    title: "BLACK & GOLD ELEGANCE",
    description: "Statement pieces and premium apparel built with uncompromising quality.",
    buttonText: "Discover Signature",
    link: "/shop?category=oversized-tshirt",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[480px] sm:h-[560px] lg:h-[640px] w-full rounded-3xl sm:rounded-4xl border-4 border-white overflow-hidden shadow-2xl flex items-end justify-center pb-14 sm:pb-16 lg:pb-20">
      {/* Background Auto Carousel Images with Smooth Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-top sm:object-center"
            priority={index === 0}
          />
          {/* Enhanced Bottom Dark Gradient Overlay for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Overlay Content Positioned Towards Bottom */}
      <div className="relative z-10 text-center px-6 sm:px-12 max-w-3xl mx-auto space-y-4 sm:space-y-5">
        <span className="inline-block text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
          {slides[current].subtitle}
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight uppercase leading-[1.08] drop-shadow-lg">
          {slides[current].title}
        </h1>

        <p className="text-xs sm:text-base text-white/90 max-w-xl mx-auto font-sans leading-relaxed drop-shadow-sm font-normal">
          {slides[current].description}
        </p>

        {/* Purchase CTA Button directly below text */}
        <div className="pt-2 flex items-center justify-center">
          <Link
            href={slides[current].link}
            className="btn-primary px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-mono uppercase tracking-widest inline-flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform duration-300 border-2 border-white/40"
          >
            <span>{slides[current].buttonText}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Manual Slide Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-md text-white border border-white/40 flex items-center justify-center hover:bg-white/45 transition-all shadow-lg active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-md text-white border border-white/40 flex items-center justify-center hover:bg-white/45 transition-all shadow-lg active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Carousel Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-white shadow-sm" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
