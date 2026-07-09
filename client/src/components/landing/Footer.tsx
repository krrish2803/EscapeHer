"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/common/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-zinc-950 py-20 px-6 md:px-8">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <Logo variant="full" size="md" className="h-8 w-auto" />

        <div className="flex flex-wrap justify-center gap-8 text-zinc-500 text-sm">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <Link href="/emergency" className="hover:text-zinc-300 transition-colors">
            Emergency Services
          </Link>
          <Link href="/settings" className="hover:text-zinc-300 transition-colors">
            Configurations
          </Link>
          <Link href="/profile" className="hover:text-zinc-300 transition-colors">
            Guardian Network
          </Link>
        </div>

        <div className="text-zinc-600 text-xs text-center md:text-right">
          <p suppressHydrationWarning>© {currentYear} EscapeHer. AI-Assisted Safety Network.</p>
          <p className="mt-1 text-zinc-700">Built for hackathon submission with Next.js & Socket.IO.</p>
        </div>
      </div>
    </footer>
  );
}
