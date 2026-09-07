"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Minus, Plus, Check, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCartButton({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { refreshCartCount, triggerBounce } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (stock === 0) {
    return (
      <div className="w-full py-3.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-600 text-center text-xs font-mono font-semibold uppercase tracking-wider">
        Product Unavailable
      </div>
    );
  }

  async function handleAddToCart() {
    if (!session) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    if (isAdded) {
      router.push("/cart");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (data.success) {
        // Trigger pulse/bounce animation on top navbar cart badge
        triggerBounce();
        await refreshCartCount();

        setIsAdded(true);
      } else {
        setErrorMessage(data.error?.message ?? "Failed to add to cart");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity Selector */}
      {!isAdded && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-brand-heading/70 uppercase">QUANTITY</span>
          <div className="flex items-center bg-brand-bg-light border border-brand-accent/20 rounded-full overflow-hidden px-1 py-0.5">
            <button
              id="qty-decrease-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-brand-dark hover:bg-brand-bg rounded-full transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-mono text-xs font-bold text-brand-dark">{quantity}</span>
            <button
              id="qty-increase-btn"
              onClick={() => setQuantity(Math.min(stock, quantity + 1))}
              className="p-2 text-brand-dark hover:bg-brand-bg rounded-full transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart / View Cart Button */}
      <button
        id="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`w-full py-4 text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 rounded-full transition-all duration-300 shadow-md ${
          isAdded
            ? "bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
            : "btn-primary hover:scale-[1.02] active:scale-98"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding to Cart...</span>
          </>
        ) : isAdded ? (
          <>
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Added to Bag — View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Order</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-2xl text-xs font-mono flex items-center justify-center gap-2 bg-rose-500/10 text-rose-700 border border-rose-500/20">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

