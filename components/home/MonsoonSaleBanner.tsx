"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Sparkles } from "lucide-react";

export default function MonsoonSaleBanner() {
  // Real-time countdown timer logic (e.g. 48 hours target)
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 58,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-brand-dark/20 shadow-2xl bg-gradient-to-r from-[#1c2c23] via-[#263e30] to-[#17241c] text-white p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Background Decorative Pattern & Image Accent */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image
            src="/hero_fashion.jpg"
            alt="Monsoon Sale Background"
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>

        {/* Left Sale Copy Content */}
        <div className="relative z-10 max-w-2xl space-y-5 text-center lg:text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-mono font-extrabold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LIMITED TIME MONSOON SALE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight uppercase leading-[1.08] text-white">
            UP TO <span className="text-amber-400 underline decoration-amber-400/50">50% OFF</span> SIGNATURE FINERY
          </h2>

          <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed max-w-xl">
            Embrace monsoon elegance with exclusive discounts across our luxury apparel, handwoven headwear, and signature leather accessories.
          </p>

          {/* Promo Coupon Tag */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>USE CODE: <strong className="text-white tracking-widest text-sm">MONSOON50</strong></span>
          </div>
        </div>

        {/* Right Timer & CTA Box */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 shrink-0 w-full lg:w-auto">
          
          {/* Countdown Clock */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono">
            {/* Hours */}
            <div className="flex flex-col items-center bg-black/50 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px] shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-white">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold mt-1">HOURS</span>
            </div>

            <span className="text-2xl font-bold text-amber-400">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center bg-black/50 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px] shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-white">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold mt-1">MINUTES</span>
            </div>

            <span className="text-2xl font-bold text-amber-400">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center bg-black/50 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px] shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-amber-400">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold mt-1">SECONDS</span>
            </div>
          </div>

          {/* CTA Link Button */}
          <Link
            href="/shop?sort=discount"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 border-2 border-amber-300"
          >
            <span>Claim Monsoon Offer</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      </div>
    </section>
  );
}
