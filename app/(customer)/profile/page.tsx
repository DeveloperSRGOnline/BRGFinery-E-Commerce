import { auth } from "@/lib/auth";
import { connectToDB } from "@/lib/db/connect";
import User from "@/models/User.model";
import Order from "@/models/Order.model";
import Navbar from "@/components/ui/Navbar";
import ProfileLogoutButton from "./ProfileLogoutButton";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "My Profile — BRG Finery" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login?callbackUrl=/profile");

  await connectToDB();

  const [dbUser, recentOrdersCount] = await Promise.all([
    User.findById(session.user.userId).lean(),
    Order.countDocuments({ userId: session.user.userId }),
  ]);

  if (!dbUser) redirect("/login");

  return (
    <div className="min-h-screen bg-brand-bg text-brand-heading">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="border-b border-brand-accent/15 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-brand-accent-subtle uppercase tracking-widest block mb-1">ACCOUNT</span>
            <h1 className="text-3xl font-extrabold text-brand-heading font-serif">User Profile</h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 font-mono text-xs uppercase font-bold">
            {dbUser.role} ACCESS
          </span>
        </div>

        {/* Profile Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="glass-panel-interactive rounded-3xl p-8 space-y-6 border border-brand-accent/15 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center text-brand-bg text-2xl font-bold font-serif shadow-md">
                {dbUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-bold text-brand-heading font-serif">{dbUser.name}</h2>
                <p className="text-xs font-mono text-brand-accent-subtle mt-1">{dbUser.email}</p>
              </div>

              <div className="pt-4 border-t border-brand-accent/15 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-brand-accent-subtle">TOTAL ORDERS</span>
                  <span className="text-brand-heading font-bold">{recentOrdersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-accent-subtle">JOINED</span>
                  <span className="text-brand-heading">
                    {new Date(dbUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button in Profile Page */}
            <div className="pt-4 border-t border-brand-accent/15">
              <ProfileLogoutButton />
            </div>
          </div>

          {/* Addresses Card */}
          <div className="md:col-span-2 glass-panel-interactive rounded-3xl p-8 space-y-6 border border-brand-accent/15">
            <div className="flex items-center justify-between border-b border-brand-accent/15 pb-4">
              <h3 className="text-base font-bold text-brand-heading font-serif flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <span>Saved Addresses ({dbUser.addresses?.length ?? 0})</span>
              </h3>
              <Link href="/orders" className="text-xs font-mono text-brand-accent font-bold hover:underline">
                View Order History →
              </Link>
            </div>

            {(!dbUser.addresses || dbUser.addresses.length === 0) ? (
              <div className="p-8 text-center text-xs font-mono text-brand-accent-subtle">
                No saved addresses. Saved shipping addresses from checkout will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {dbUser.addresses.map((addr: any, i: number) => (
                  <div key={i} className="bg-white/60 border border-brand-accent/15 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-heading font-bold uppercase">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-brand-accent-muted leading-relaxed">
                      {addr.line1} {addr.line2 ? `, ${addr.line2}` : ""}<br />
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
