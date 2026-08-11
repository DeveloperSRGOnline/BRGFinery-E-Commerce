import { Suspense } from "react";
import Link from "next/link";
import { connectToDB } from "@/lib/db/connect";
import Product from "@/models/Product.model";
import Category from "@/models/Category.model";
import Navbar from "@/components/ui/Navbar";
import FilterBar from "@/components/product/FilterBar";
import ProductCard from "@/components/product/ProductCard";
import Footer from "@/components/ui/Footer";

async function getProducts(searchParams: Record<string, string | string[] | undefined>) {
  await connectToDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { isActive: true };

  const page = Math.max(1, parseInt(String(searchParams.page ?? "1")));
  const limit = 12;
  const skip = (page - 1) * limit;

  // Category filter
  const categorySlug = String(searchParams.category ?? "");
  if (categorySlug) {
    const cat = await Category.findOne({ slug: categorySlug }).lean();
    if (cat) filter.categoryId = cat._id;
  }

  // Price range (in paise)
  const minPrice = parseInt(String(searchParams.minPrice ?? ""));
  const maxPrice = parseInt(String(searchParams.maxPrice ?? ""));
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    filter.price = {};
    if (!isNaN(minPrice)) filter.price.$gte = minPrice;
    if (!isNaN(maxPrice)) filter.price.$lte = maxPrice;
  }

  // Text search
  const q = String(searchParams.q ?? "");
  if (q) filter.$text = { $search: q };

  // Sort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sortOption: Record<string, any> = { createdAt: -1 };
  const sort = String(searchParams.sort ?? "");
  if (sort === "price_asc") sortOption = { price: 1 };
  else if (sort === "price_desc") sortOption = { price: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name slug")
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
}

async function getCategories() {
  await connectToDB();
  return Category.find({}).sort({ name: 1 }).lean();
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: "Shop Luxury Finery & Apparel — BRG Finery",
  description: "Explore refined black & gold luxury apparel, crafted signature pieces, and premium lifestyle essentials.",
};

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const currentCategory = String(params.category ?? "");
  const currentSort = String(params.sort ?? "");
  const currentQuery = String(params.q ?? "");
  const currentMinPrice = params.minPrice ? parseInt(String(params.minPrice)) : undefined;
  const currentMaxPrice = params.maxPrice ? parseInt(String(params.maxPrice)) : undefined;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading selection:bg-[#7d4000] selection:text-white relative overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-accent/15 pb-8">
          <div>
            <span className="text-xs font-mono text-brand-accent-subtle uppercase tracking-[0.25em] block mb-2 font-bold">
              CURATED COLLECTION
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-heading font-serif uppercase tracking-tight">
              LUXURY SHOP
            </h1>
          </div>
          <p className="text-xs font-mono text-brand-accent-muted bg-brand-bg-light px-4 py-2 rounded-full border border-brand-accent/15 shadow-xs">
            {total === 0
              ? "0 MATCHES FOUND"
              : `SHOWING ${(page - 1) * 12 + 1}–${Math.min(page * 12, total)} OF ${total} ITEMS`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-72 flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-brand-bg-light/60 rounded-3xl animate-pulse border border-brand-accent/15" />}>
              <FilterBar
                categories={categories.map((c) => ({
                  _id: c._id.toString(),
                  name: c.name,
                  slug: c.slug,
                }))}
                currentCategory={currentCategory || undefined}
                currentMinPrice={currentMinPrice}
                currentMaxPrice={currentMaxPrice}
                currentSort={currentSort || undefined}
                currentQuery={currentQuery || undefined}
              />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-brand-bg-light rounded-3xl p-16 text-center space-y-4 border border-brand-accent/15 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-accent/20 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🔍
                </div>
                <h3 className="text-brand-heading text-xl font-bold font-serif uppercase">
                  No matching items found
                </h3>
                <p className="text-xs text-brand-accent-muted max-w-sm mx-auto font-sans leading-relaxed">
                  Try clearing your search query or adjusting your category and price range filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((product: any) => (
                  <ProductCard key={product._id.toString()} product={{ ...product, _id: product._id.toString() }} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4 border-t border-brand-accent/15 pt-8">
                {page > 1 && (
                  <Link
                    href={`/shop?${new URLSearchParams({ ...params as Record<string, string>, page: String(page - 1) })}`}
                    className="btn-secondary px-5 py-2.5 text-xs font-mono uppercase"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-xs font-mono text-brand-accent-muted uppercase tracking-wider font-semibold">
                  PAGE {page} OF {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/shop?${new URLSearchParams({ ...params as Record<string, string>, page: String(page + 1) })}`}
                    className="btn-secondary px-5 py-2.5 text-xs font-mono uppercase"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
