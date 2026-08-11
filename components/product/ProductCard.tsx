import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number; // In paise
  stock: number;
  ratingAvg: number;
  ratingCount: number;
  images: { url: string; publicId: string }[];
  categoryId: { name: string; slug: string } | string;
}

function StarRating({ avg, count }: { avg?: number; count?: number }) {
  const safeAvg = avg ?? 5;
  const safeCount = count ?? 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(safeAvg) ? "text-amber-500 fill-amber-500" : "text-brand-accent/20"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-brand-accent-muted font-mono text-[11px] font-semibold">({safeCount})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const priceInRupees = (product?.price ?? 0) > 5000 ? (product.price / 100) : (product?.price ?? 0);
  const category = typeof product.categoryId === "object" ? product.categoryId : null;
  const imageUrl = product.images?.[0]?.url;

  return (
    <Link href={`/shop/${product.slug}`} className="group block h-full">
      <div className="bg-white rounded-3xl overflow-hidden flex flex-col h-full border border-brand-accent/15 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        {/* Product Visual */}
        <div className="relative aspect-[4/3] bg-[#f4ece1] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f4ece1] to-[#e2ceb9]">
              <svg className="w-10 h-10 text-brand-accent/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            {category ? (
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-brand-heading bg-white/90 backdrop-blur-md border border-brand-accent/20 px-3 py-1 rounded-full shadow-xs">
                {category.name}
              </span>
            ) : <span />}

            {product.stock === 0 ? (
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full shadow-xs">
                Sold Out
              </span>
            ) : product.stock < 5 ? (
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shadow-xs">
                {product.stock} Left
              </span>
            ) : null}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4 text-left">
          <div className="space-y-2">
            <h3 className="text-brand-heading font-serif font-bold text-lg leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">
              {product.name}
            </h3>
            <StarRating avg={product.ratingAvg} count={product.ratingCount} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-brand-accent/15">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-accent-subtle block leading-none mb-1 uppercase tracking-wider">PRICE</span>
              <span className="text-xl font-bold text-brand-heading font-serif tracking-tight">
                ₹{priceInRupees.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="w-9 h-9 rounded-xl bg-brand-dark group-hover:bg-brand-dark-hover text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
