import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectToDB } from "@/lib/db/connect";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import Review from "@/models/Review.model";
import Navbar from "@/components/ui/Navbar";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import Footer from "@/components/ui/Footer";
import { Star, ShieldCheck, ArrowRight, ChevronRight, Package, Truck, RefreshCw } from "lucide-react";

async function getProduct(slug: string) {
  await connectToDB();
  const product = await Product.findOne({ slug, isActive: true })
    .populate("categoryId", "name slug")
    .lean();
  return product;
}

async function getReviews(productId: string) {
  const reviews = await Review.find({ productId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("userId", "name")
    .lean();
  return reviews;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found — BRG Finery" };
  return {
    title: `${product.name} — BRG Finery`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getReviews(product._id.toString());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = product.categoryId as any;

  // Real Unsplash dummy fallback image matching the product name
  const fallbackImage = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop`;
  const mainImageUrl = product.images?.[0]?.url || fallbackImage;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading selection:bg-[#7d4000] selection:text-white relative overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-brand-accent-muted mb-10">
          <Link href="/" className="hover:text-brand-heading transition-colors">HOME</Link>
          <ChevronRight className="w-3 h-3 text-brand-accent-subtle" />
          <Link href="/shop" className="hover:text-brand-heading transition-colors">SHOP</Link>
          {category && (
            <>
              <ChevronRight className="w-3 h-3 text-brand-accent-subtle" />
              <Link href={`/shop?category=${category.slug}`} className="hover:text-brand-heading transition-colors uppercase">{category.name}</Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-brand-accent-subtle" />
          <span className="text-brand-heading font-bold truncate max-w-xs uppercase">{product.name}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Visual Gallery (Left) */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Product Specifications & Order Box (Right) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              {category && (
                <Link href={`/shop?category=${category.slug}`} className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-accent uppercase tracking-widest bg-brand-bg-light px-4 py-1.5 rounded-full border border-brand-accent/20 shadow-xs">
                  {category.name}
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-heading font-serif uppercase leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.ratingAvg ?? 5) ? "text-[#7d4000] fill-[#7d4000]" : "text-brand-accent/20"}`} />
                  ))}
                </div>
                <span className="text-xs font-mono text-brand-accent-muted font-semibold">{(product.ratingAvg ?? 5).toFixed(1)} ({product.ratingCount ?? 0} reviews)</span>
              </div>
            </div>

            {/* Price & Stock Container */}
            <div className="bg-brand-bg-light p-6 sm:p-8 rounded-3xl border border-brand-accent/15 shadow-xs space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono text-brand-accent-subtle block mb-1 font-bold">PRICE INCL. GST</span>
                  <span className="text-4xl font-bold text-brand-heading font-serif">
                    ₹{(product.price / 100).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full font-mono text-xs uppercase font-bold ${product.stock > 0 ? "bg-emerald-900/10 text-emerald-800 border border-emerald-800/20" : "bg-rose-900/10 text-rose-800 border border-rose-800/20"}`}>
                  {product.stock > 0 ? `${product.stock} IN STOCK` : "OUT OF STOCK"}
                </span>
              </div>

              <p className="text-xs text-brand-accent-muted leading-relaxed pt-2 border-t border-brand-accent/15 font-sans">{product.description}</p>

              {/* Add to Cart Component */}
              <AddToCartButton
                productId={product._id.toString()}
                stock={product.stock}
              />
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-brand-bg-light p-4 rounded-2xl text-center space-y-1 border border-brand-accent/15 shadow-xs">
                <Truck className="w-5 h-5 text-brand-accent mx-auto" />
                <span className="text-[11px] font-mono text-brand-heading font-semibold block">Fast Shipping</span>
              </div>
              <div className="bg-brand-bg-light p-4 rounded-2xl text-center space-y-1 border border-brand-accent/15 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-brand-accent mx-auto" />
                <span className="text-[11px] font-mono text-brand-heading font-semibold block">Razorpay Auth</span>
              </div>
              <div className="bg-brand-bg-light p-4 rounded-2xl text-center space-y-1 border border-brand-accent/15 shadow-xs">
                <RefreshCw className="w-5 h-5 text-brand-accent mx-auto" />
                <span className="text-[11px] font-mono text-brand-heading font-semibold block">7-Day Return</span>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-brand-accent/15 pt-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-heading font-serif uppercase mb-8">Verified Customer Reviews</h2>
          {reviews.length === 0 ? (
            <div className="bg-brand-bg-light rounded-3xl p-12 text-center text-xs font-mono text-brand-accent-muted border border-brand-accent/15">
              NO REVIEWS FOR THIS PRODUCT YET
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {reviews.map((review: any) => (
                <div key={review._id.toString()} className="bg-brand-bg-light rounded-3xl p-6 space-y-3 border border-brand-accent/15 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-heading font-serif uppercase">{review.userId?.name ?? "Customer"}</span>
                    <span className="text-[11px] font-mono text-brand-accent-muted">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? "text-[#7d4000] fill-[#7d4000]" : "text-brand-accent/20"}`} />
                    ))}
                  </div>
                  {review.comment && <p className="text-xs text-brand-accent-muted leading-relaxed font-sans">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
