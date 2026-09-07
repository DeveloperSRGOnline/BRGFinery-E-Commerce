import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import SubscribeSection from "@/components/home/SubscribeSection";
import { Sparkles, ShieldCheck, Gem, Award, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us — BRG Finery",
  description: "Learn about BRG Finery's passion for premium quality apparel, luxury craftsmanship, and signature black & gold aesthetic.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading selection:bg-[#7d4000] selection:text-white relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-bg-light border border-brand-accent/20 text-xs font-mono tracking-widest uppercase text-brand-accent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Story & Craftsmanship</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark tracking-tight uppercase leading-tight">
            Crafting Luxury Apparel for the Bold &amp; Awesome
          </h1>
          <p className="text-sm sm:text-base font-sans text-brand-heading/80 leading-relaxed max-w-2xl mx-auto">
            BRG Finery was born out of a relentless desire to redefine luxury streetwear. We blend master craftsmanship, rich textures, and contemporary tailoring to empower your everyday expression.
          </p>
        </div>

        {/* Feature Banner Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-brand-accent/15 group">
            <Image
              src="/brg-logo.webp"
              alt="BRG Finery Heritage"
              fill
              className="object-contain p-8 bg-brand-dark group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Established Excellence</span>
              <h2 className="text-2xl font-serif font-bold mt-1">Signature Black &amp; Gold Aesthetics</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-brand-bg-light border border-brand-accent/15 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-mono">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-dark">Uncompromising Material Quality</h3>
              <p className="text-xs sm:text-sm font-sans text-brand-heading/75 leading-relaxed">
                From high-gsm combed cottons to heavy-weight luxury fleece, every thread is sourced and tested to ensure lasting softness, breathability, and structure.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-brand-bg-light border border-brand-accent/15 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-mono">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-dark">Precision Tailoring &amp; Fit</h3>
              <p className="text-xs sm:text-sm font-sans text-brand-heading/75 leading-relaxed">
                Whether it's our signature Crop Tees, Normal Fit, or Gen-Z Oversized Silhouettes, every pattern is engineered for maximum confidence and effortless style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-brand-bg-light border-y border-brand-accent/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark uppercase">
              Our Core Pillars
            </h2>
            <p className="text-xs sm:text-sm font-mono text-brand-heading/70 uppercase tracking-wider">
              What sets BRG Finery apart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-8 rounded-3xl bg-brand-bg border border-brand-accent/15 space-y-4 hover:shadow-md transition-shadow">
              <ShieldCheck className="w-8 h-8 text-brand-accent" />
              <h3 className="text-lg font-serif font-bold text-brand-dark">Authenticity Guaranteed</h3>
              <p className="text-xs font-sans text-brand-heading/80 leading-relaxed">
                Every piece is original and designed in-house. We maintain strict quality control standards to deliver only perfection.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-bg border border-brand-accent/15 space-y-4 hover:shadow-md transition-shadow">
              <HeartHandshake className="w-8 h-8 text-brand-accent" />
              <h3 className="text-lg font-serif font-bold text-brand-dark">Customer Obsession</h3>
              <p className="text-xs font-sans text-brand-heading/80 leading-relaxed">
                Your satisfaction comes first. Fast shipping, responsive support, and seamless returns make your shopping experience effortless.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-bg border border-brand-accent/15 space-y-4 hover:shadow-md transition-shadow">
              <Sparkles className="w-8 h-8 text-brand-accent" />
              <h3 className="text-lg font-serif font-bold text-brand-dark">Modern Aesthetic</h3>
              <p className="text-xs font-sans text-brand-heading/80 leading-relaxed">
                Clean lines, subtle branding, and timeless colors ensure our collections elevate your daily rotation with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark uppercase">
          Ready to Elevate Your Wardrobe?
        </h2>
        <p className="text-sm font-sans text-brand-heading/80 max-w-xl mx-auto">
          Explore our newest arrivals and discover why fashion enthusiasts trust BRG Finery.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 btn-primary px-8 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Subscribe Section */}
      <SubscribeSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
