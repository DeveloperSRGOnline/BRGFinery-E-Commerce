"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, MessageSquare, Sparkles } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading selection:bg-[#7d4000] selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 w-full flex-1">
        {/* Header Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-mono font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WE'RE HERE TO HELP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-brand-dark uppercase tracking-tight">
            Contact <span className="text-amber-600">BRG Finery</span>
          </h1>

          <p className="text-sm sm:text-base font-sans text-brand-body leading-relaxed">
            Have questions about your order, custom inquiries, or feedback? Reach out to our concierge team and we will get back to you promptly.
          </p>
        </div>

        {/* 2-Column Section: Left Info Cards & Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Contact Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-brand-dark text-white shadow-xl space-y-6 relative overflow-hidden border border-brand-accent/20">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <h2 className="text-xl font-serif font-bold uppercase tracking-tight text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Get In Touch</span>
              </h2>

              <ul className="space-y-6 text-xs font-mono text-zinc-300">
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white/10 text-amber-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 font-bold uppercase text-[11px] mb-0.5">Phone Support</h3>
                    <a href="tel:+919209387831" className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                      +91 92093 87831
                    </a>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Mon - Sat (10:00 AM - 7:00 PM IST)</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white/10 text-amber-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 font-bold uppercase text-[11px] mb-0.5">Email Support</h3>
                    <a href="mailto:support@brgfinery.com" className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                      support@brgfinery.com
                    </a>
                    <p className="text-[11px] text-zinc-400 mt-0.5">24/7 Response for general inquiries</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white/10 text-amber-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 font-bold uppercase text-[11px] mb-0.5">Flagship Studio & Store</h3>
                    <p className="text-xs font-semibold text-white leading-relaxed">
                      BRG Finery Studio & Boutique, India
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white/10 text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 font-bold uppercase text-[11px] mb-0.5">Business Hours</h3>
                    <p className="text-xs text-zinc-300">Monday - Saturday: 10 AM - 7 PM</p>
                    <p className="text-xs text-zinc-400">Sunday: Closed</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-brand-dark/10 shadow-xl space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-dark uppercase tracking-tight">
                Send Us A Message
              </h2>
              <p className="text-xs font-sans text-brand-body mt-1">
                Fill in the details below and our concierge team will respond within 24 business hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-mono flex flex-col items-center justify-center text-center space-y-3 py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                <span className="font-bold text-base text-emerald-900">Message Submitted Successfully!</span>
                <span className="max-w-md text-emerald-700">
                  Thank you for reaching out to BRG Finery. Our concierge team will review your inquiry and get back to you shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                {/* Name */}
                <div>
                  <label className="block text-brand-dark font-bold mb-1 text-[11px] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-brand-dark placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                  />
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-brand-dark font-bold mb-1 text-[11px] uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-brand-dark placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-brand-dark font-bold mb-1 text-[11px] uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-brand-dark placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-brand-dark font-bold mb-1 text-[11px] uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Order Inquiry / Custom Request"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-brand-dark placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-brand-dark font-bold mb-1 text-[11px] uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-brand-dark placeholder-zinc-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-brand-dark hover:bg-black text-amber-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] text-xs"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
