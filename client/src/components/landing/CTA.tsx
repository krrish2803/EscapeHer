"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertOctagon, ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CTA() {
  return (
    <section className="py-24 bg-black relative px-4 border-t border-zinc-900">
      {/* Visual background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-8 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full filter blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full filter blur-[60px]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-8 animate-pulse">
              <ShieldAlert className="size-8" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 max-w-2xl leading-tight">
              Seconds Save Lives. Be Prepared.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl">
              Enable instant AI protection. Get real-time updates and trigger safeguards immediately when danger looms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link
                href="/danger-mode"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                )}
              >
                <AlertOctagon className="size-5" />
                LAUNCH DANGER MODE NOW
              </Link>
              <Link
                href="/emergency"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:text-white hover:bg-zinc-900 h-14 px-8 rounded-xl"
                )}
              >
                Emergency Contact List
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
