"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ProfileLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-primary w-full py-3 px-6 text-xs font-mono uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:bg-rose-900 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
