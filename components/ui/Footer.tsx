"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-brand-accent/20 bg-brand-dark text-white pt-16 pb-8 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Main Footer Links Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-black tracking-wider text-amber-400">
                BRG FINERY
              </span>
            </div>
            <p className="text-xs font-sans text-zinc-300 leading-relaxed max-w-xs">
              Luxury apparel & signature black &amp; gold lifestyle essentials. Designed with master craftsmanship for the modern trendsetter.
            </p>
            {/* Social Media */}
            <div className="pt-2">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {["Instagram", "Facebook", "Twitter", "Pinterest"].map((platform) => (
                  <a
                    key={platform}
                    href={`https://${platform.toLowerCase()}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-amber-400 hover:text-black transition-colors text-[11px]"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
              Contact Info
            </h3>
            <ul className="space-y-3 text-xs font-mono text-zinc-300">
              <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919209387831" className="font-semibold text-white tracking-wide">
                  +91 92093 87831
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>BRG Finery Flagship Store & Studio, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@brgfinery.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
              Important Links
            </h3>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-300">
              <li>
                <Link href="/contactus" className="hover:text-amber-400 transition-colors font-semibold text-amber-300">
                  Contact Us Form →
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-amber-400 transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-and-exchange" className="hover:text-amber-400 transition-colors">
                  Returns and Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-amber-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-2">
              Our Collections
            </h3>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-300">
              <li>
                <Link href="/shop?category=crop-tshirts" className="hover:text-amber-400 transition-colors">
                  Crop T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=normal-fit" className="hover:text-amber-400 transition-colors">
                  Normal Fit
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gen-z" className="hover:text-amber-400 transition-colors">
                  Gen-Z Finery
                </Link>
              </li>
              <li>
                <Link href="/shop?category=oversized-tshirts" className="hover:text-amber-400 transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights Reserved Bar */}
        <div className="pt-8 text-center text-xs font-mono text-zinc-400">
          <p>
            Design &amp; Developed by <strong className="text-amber-400 font-semibold">KodeKalp Global Technologies</strong>. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
