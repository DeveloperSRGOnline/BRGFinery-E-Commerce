"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
  lineTotal: number;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setCartData(data.data);
    } catch {
      console.error("Failed to fetch cart");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function updateQuantity(productId: string, newQty: number) {
    if (newQty < 1) return removeItem(productId);

    setUpdatingId(productId);
    try {
      await fetch(`/api/cart/items/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      await fetchCart();
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeItem(productId: string) {
    setUpdatingId(productId);
    try {
      await fetch(`/api/cart/items/${productId}`, { method: "DELETE" });
      await fetchCart();
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout/create-order", { method: "POST" });
      const data = await res.json();

      if (!data.success) {
        alert(data.error?.message ?? "Checkout failed");
        return;
      }

      const {
        razorpayOrderId,
        amount,
        keyId,
        userName,
        userEmail,
      } = data.data;

      // Load Razorpay SDK dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay({
          key: keyId,
          amount,
          currency: "INR",
          order_id: razorpayOrderId,
          name: "BRG Finery",
          description: "Luxury Apparel Checkout",
          prefill: { name: userName, email: userEmail },
          theme: { color: "#1e3a2b" },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const confirmRes = await fetch("/api/checkout/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                shippingAddressIndex: 0,
              }),
            });

            const confirmData = await confirmRes.json();
            if (confirmData.success) {
              router.push(`/orders/${confirmData.data.orderId}?success=true`);
            } else {
              console.error("[Razorpay Verification Error]:", confirmData);
              const errorMsg = confirmData?.error?.message || "Payment verification failed. Please contact support.";
              alert(`Payment Verification Issue: ${errorMsg}`);
            }
          },
          modal: {
            ondismiss: () => setIsCheckingOut(false),
          },
        });

        rzp.open();
      };

      document.body.appendChild(script);
    } catch {
      setIsCheckingOut(false);
      alert("Checkout failed. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-heading flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
      </div>
    );
  }

  const isEmpty = !cartData || cartData.items.length === 0;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading selection:bg-[#7d4000] selection:text-white relative overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
        <div className="mb-8 sm:mb-12 border-b border-brand-accent/15 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-bg-light border border-brand-accent/20 text-xs font-mono tracking-widest uppercase text-brand-accent mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YOUR BAG SELECTION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark uppercase tracking-tight">
            Shopping Cart
          </h1>
        </div>

        {isEmpty ? (
          <div className="p-12 sm:p-20 text-center space-y-5 rounded-3xl bg-brand-bg-light border border-brand-accent/15 shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mx-auto text-brand-dark">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">Your Shopping Cart is Empty</h2>
            <p className="text-xs sm:text-sm font-sans text-brand-heading/70 max-w-sm mx-auto">
              Explore our luxury apparel collections and add signature pieces to your cart.
            </p>
            <div className="pt-3">
              <Link href="/shop" className="btn-primary inline-flex px-8 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider shadow-md hover:scale-105 transition-transform">
                Browse Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartData?.items.map((item) => (
                <div key={item.productId} className="p-4 sm:p-5 rounded-3xl bg-brand-bg-light border border-brand-accent/15 shadow-xs flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between transition-all hover:border-brand-accent/30">
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-brand-bg border border-brand-accent/10">
                      <Image
                        src={item.image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop`}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <Link href={`/shop/${item.slug}`} className="text-brand-dark font-serif font-bold text-base sm:text-lg hover:text-brand-accent transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs font-mono text-brand-heading/70">₹{(item.price / 100).toLocaleString("en-IN")} EACH</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-brand-accent/10 pt-3 sm:pt-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-brand-bg border border-brand-accent/20 rounded-full px-1.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={updatingId === item.productId}
                        className="p-1.5 text-brand-dark hover:bg-brand-bg-light rounded-full disabled:opacity-40 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono text-xs font-bold text-brand-dark">
                        {updatingId === item.productId ? "..." : item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={updatingId === item.productId || item.quantity >= item.stock}
                        className="p-1.5 text-brand-dark hover:bg-brand-bg-light rounded-full disabled:opacity-40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      id={`remove-item-${item.productId}`}
                      onClick={() => removeItem(item.productId)}
                      disabled={updatingId === item.productId}
                      title="Remove item"
                      className="p-2 text-rose-600/70 hover:text-rose-700 disabled:opacity-40 transition-colors rounded-full hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="text-right min-w-[5.5rem]">
                      <span className="text-brand-dark font-serif font-bold text-base sm:text-lg">
                        ₹{(item.lineTotal / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Side Panel */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-8 rounded-3xl bg-brand-bg-light border border-brand-accent/15 shadow-xs space-y-6 sticky top-28">
                <h2 className="text-xl font-serif font-bold text-brand-dark uppercase border-b border-brand-accent/15 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-xs font-mono text-brand-heading">
                  <div className="flex justify-between">
                    <span className="text-brand-heading/70">SUBTOTAL</span>
                    <span className="font-semibold text-brand-dark">₹{(cartData.subtotal / 100).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-heading/70">ESTIMATED GST (18%)</span>
                    <span className="font-semibold text-brand-dark">₹{(cartData.tax / 100).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-brand-accent/15 pt-4 flex justify-between text-sm font-bold">
                    <span className="text-brand-dark font-serif uppercase">TOTAL AMOUNT</span>
                    <span className="text-brand-accent font-mono text-base font-bold">
                      ₹{(cartData.total / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  id="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn-primary w-full py-4 text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-brand-heading/70 pt-1">
                  <ShieldCheck className="w-4 h-4 text-brand-accent" />
                  <span>Secured 256-Bit Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
