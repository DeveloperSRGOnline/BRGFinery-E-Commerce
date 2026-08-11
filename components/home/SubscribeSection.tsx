"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, CheckCircle2 } from "lucide-react";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 5000);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Clean Graphic sitting seamlessly on website background */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="w-full max-w-md lg:max-w-xl relative aspect-[4/3]">
            <Image
              src="/trend_subscribe_illustration_clean.jpg"
              alt="Trend Updates"
              fill
              className="object-contain object-center select-none mix-blend-multiply"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Right Column: Minimalist Heading & Input */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Main Clean Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-brand-heading leading-[1.12] tracking-tight">
            The latest <span className="text-brand-accent italic font-serif">trend updates</span> from <span className="text-brand-dark">BRG Finery</span> in your inbox.
          </h2>

          {/* Minimal Input & Send Button */}
          <div className="pt-2 max-w-md">
            {isSubscribed ? (
              <div className="flex items-center gap-3 p-4 rounded-full bg-brand-dark text-[#E2CEB9] text-xs font-mono">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Thank you! You are now subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-3.5 rounded-full bg-brand-bg-light border border-brand-accent/20 text-brand-heading placeholder-brand-heading/50 text-sm font-sans focus:outline-none focus:border-brand-dark transition-all"
                />

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-brand-dark hover:bg-brand-dark-hover text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 shadow-sm"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
