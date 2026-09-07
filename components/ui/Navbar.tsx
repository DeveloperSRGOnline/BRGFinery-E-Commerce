"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cartCount, isBouncing } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const logoUrl = "/brg-logo.webp";

  const isActive = (href: string) => {
    if (href.includes('?')) {
      const [path] = href.split('?');
      return pathname === path;
    }
    return pathname === href;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };



  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-transparent py-2">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <div className="flex items-center justify-between h-24 sm:h-28">
          {/* Logo Badge */}
          <Link href="/" className="flex items-center gap-4 group py-2">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-sm group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="BRG Finery Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain rounded-full"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-heading font-serif uppercase leading-none">
                BRG FINERY
              </span>
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-brand-accent-subtle uppercase mt-1">
                U R AWESOME
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center gap-2.5 p-2 rounded-full bg-brand-bg-light backdrop-blur-md border border-brand-accent/15 text-sm font-mono tracking-wider uppercase text-brand-heading shadow-xs">
            
            <Link href="/" className={`px-5 py-2 rounded-full font-semibold transition-colors ${isActive('/') ? 'bg-brand-dark text-white' : 'text-brand-heading hover:bg-brand-bg'}`}>
              Home
            </Link>
            <div className="relative products-dropdown">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className={`px-5 flex items-center gap-1.5 py-2 rounded-full font-semibold transition-colors ${pathname.startsWith('/shop') ? 'bg-brand-dark text-white' : 'text-brand-heading hover:bg-brand-bg'}`}
              >
                SHOP
                <span className="ml-1 text-xs opacity-70">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              {isProductsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-brand-dark/10 py-2.5 z-50">
                  <Link href="/shop" className="block px-5 py-2.5 text-xs font-mono text-brand-heading hover:bg-brand-bg transition-colors" onClick={() => setIsProductsDropdownOpen(false)}>
                    All
                  </Link>
                  <Link href="/shop?category=crop-tshirt" className="block px-5 py-2.5 text-xs font-mono text-brand-heading hover:bg-brand-bg transition-colors" onClick={() => setIsProductsDropdownOpen(false)}>
                    Crop Tshirt
                  </Link>
                  <Link href="/shop?category=normal-fit" className="block px-5 py-2.5 text-xs font-mono text-brand-heading hover:bg-brand-bg transition-colors" onClick={() => setIsProductsDropdownOpen(false)}>
                    Normal Fit
                  </Link>
                  <Link href="/shop?category=gen-x" className="block px-5 py-2.5 text-xs font-mono text-brand-heading hover:bg-brand-bg transition-colors" onClick={() => setIsProductsDropdownOpen(false)}>
                    Gen-X
                  </Link>
                  <Link href="/shop?category=oversized-tshirt" className="block px-5 py-2.5 text-xs font-mono text-brand-heading hover:bg-brand-bg transition-colors" onClick={() => setIsProductsDropdownOpen(false)}>
                    Oversized Tshirt
                  </Link>
                </div>
              )}
            </div>
            <Link href="/about" className={`px-5 py-2 rounded-full font-semibold transition-colors ${isActive('/about') ? 'bg-brand-dark text-white' : 'text-brand-heading hover:bg-brand-bg'}`}>
              About
            </Link>
            <Link href="/contactus" className={`px-5 py-2 rounded-full font-semibold transition-colors ${isActive('/contactus') ? 'bg-brand-dark text-white' : 'text-brand-heading hover:bg-brand-bg'}`}>
              Contact Us
            </Link>
          </nav>

          {/* User Actions: Search Circle + Cart Capsule + Round Profile Circle */}
          <div className="hidden md:flex items-center gap-3 text-sm font-mono text-brand-heading">
            {/* Round Search Button Circle (Placed on left side of Cart/Profile) */}
            <div className="relative search-container">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                title="Search products"
                className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-xs transition-all ${isSearchOpen ? 'bg-brand-dark text-white border-brand-dark' : 'bg-brand-bg-light text-brand-heading border-brand-accent/20 hover:border-brand-accent/60 hover:bg-brand-bg'}`}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Popup Search Bar Input */}
              {isSearchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-brand-dark/10 p-2.5 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    className="w-full bg-brand-bg-light/60 border border-brand-accent/15 rounded-xl px-3.5 py-2 text-xs font-mono text-brand-heading focus:outline-none focus:border-brand-dark"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-hover transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Cart Capsule */}
            <Link
              href="/cart"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-bg-light backdrop-blur-md border border-brand-accent/15 font-semibold text-brand-heading shadow-xs transition-all hover:bg-brand-bg hover:border-brand-accent/40 ${isActive('/cart') ? 'bg-brand-dark text-white border-brand-dark' : ''} ${isBouncing ? "scale-105" : ""}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart({cartCount})</span>
            </Link>

            {/* Round Profile Avatar Circle */}
            {session?.user ? (
              <Link
                href="/profile"
                title="View Profile"
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border shadow-xs transition-all ${isActive('/profile') ? 'bg-brand-dark text-white border-brand-dark' : 'bg-brand-bg-light text-brand-heading border-brand-accent/20 hover:border-brand-accent/60 hover:bg-brand-bg'}`}
              >
                {(session.user.name ?? "U").charAt(0).toUpperCase()}
              </Link>
            ) : (
              <div className="flex items-center gap-3.5 ml-1">
                <Link href="/login" className="btn-secondary px-6 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary px-7 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden p-2.5 text-brand-heading"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Floating Mobile Dropdown Overlay */}
        {isMenuOpen && (
          <>
            {/* Transparent Dismiss Backdrop */}
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Floating Mobile Menu Card */}
            <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-full mt-2 z-50 md:hidden py-5 px-4 border border-brand-accent/20 space-y-3 font-mono text-xs uppercase bg-brand-bg-light/95 backdrop-blur-xl rounded-3xl shadow-2xl text-brand-heading animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH PRODUCTS..."
                  className="w-full bg-white border border-brand-accent/20 rounded-2xl px-4 py-2.5 text-xs font-mono text-brand-heading focus:outline-none focus:border-brand-dark shadow-xs"
                />
                <button type="submit" className="p-2.5 bg-brand-dark text-white rounded-2xl shadow-xs hover:bg-brand-dark-hover transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <Link
                href="/"
                className={`block font-semibold px-4 py-2.5 rounded-2xl transition-all ${isActive('/') ? 'bg-brand-dark text-white font-bold shadow-xs' : 'text-brand-heading hover:bg-brand-bg/80'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <div>
                <button 
                  onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                  className={`flex items-center justify-between w-full font-semibold px-4 py-2.5 rounded-2xl transition-all ${pathname.startsWith('/shop') ? 'bg-brand-dark text-white font-bold shadow-xs' : 'text-brand-heading hover:bg-brand-bg/80'}`}
                >
                  <span>SHOP</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileShopOpen && (
                  <div className="space-y-1.5 pl-4 mt-2 border-l-2 border-brand-dark/20 ml-3">
                    <Link href="/shop" className={`block px-4 py-2 rounded-xl font-medium transition-all ${pathname === '/shop' ? 'bg-brand-dark text-white font-bold' : 'text-brand-heading hover:bg-brand-bg/80'}`} onClick={() => setIsMenuOpen(false)}>All Items</Link>
                    <Link href="/shop?category=crop-tshirt" className="block px-4 py-2 rounded-xl text-brand-heading hover:bg-brand-bg/80 transition-all" onClick={() => setIsMenuOpen(false)}>Crop Tshirt</Link>
                    <Link href="/shop?category=normal-fit" className="block px-4 py-2 rounded-xl text-brand-heading hover:bg-brand-bg/80 transition-all" onClick={() => setIsMenuOpen(false)}>Normal Fit</Link>
                    <Link href="/shop?category=gen-x" className="block px-4 py-2 rounded-xl text-brand-heading hover:bg-brand-bg/80 transition-all" onClick={() => setIsMenuOpen(false)}>Gen-X</Link>
                    <Link href="/shop?category=oversized-tshirt" className="block px-4 py-2 rounded-xl text-brand-heading hover:bg-brand-bg/80 transition-all" onClick={() => setIsMenuOpen(false)}>Oversized Tshirt</Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className={`block font-semibold px-4 py-2.5 rounded-2xl transition-all ${isActive('/about') ? 'bg-brand-dark text-white font-bold shadow-xs' : 'text-brand-heading hover:bg-brand-bg/80'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link
                href="/contactus"
                className={`block font-semibold px-4 py-2.5 rounded-2xl transition-all ${isActive('/contactus') ? 'bg-brand-dark text-white font-bold shadow-xs' : 'text-brand-heading hover:bg-brand-bg/80'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              <Link
                href="/cart"
                className={`flex items-center justify-between font-semibold px-4 py-2.5 rounded-2xl transition-all ${isActive('/cart') ? 'bg-brand-dark text-white font-bold shadow-xs' : 'text-brand-heading hover:bg-brand-bg/80'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-dark text-white text-[10px] font-bold">{cartCount}</span>
              </Link>

              {session?.user ? (
                <Link
                  href="/profile"
                  className={`block font-semibold px-4 py-2.5 rounded-2xl transition-all ${isActive('/profile') ? 'bg-brand-dark text-white font-bold shadow-xs' : 'text-brand-heading hover:bg-brand-bg/80'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile ({session.user.name ?? "Account"})
                </Link>
              ) : (
                <div className="pt-3 border-t border-brand-accent/15 flex items-center gap-3">
                  <Link
                    href="/login"
                    className="btn-secondary flex-1 py-2.5 text-center text-xs font-mono uppercase tracking-wider"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary flex-1 py-2.5 text-center text-xs font-mono uppercase tracking-wider"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
