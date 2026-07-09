"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const alertRingVariants: Variants = {
    animate: {
      scale: [1, 1.3, 1.6, 1.3, 1],
      opacity: [0.1, 0.4, 0, 0.4, 0.1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black py-20 px-4">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.08),transparent_50%)]" />
      
      {/* Mesh Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-950/20 backdrop-blur-md text-red-400 text-xs font-semibold tracking-wider uppercase mb-8"
          >
            <Sparkles className="size-3.5 text-red-500 animate-pulse" />
            AI-Assisted Emergency Response
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6"
          >
            Empowering Women to <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">Escape & Evade</span> Danger Instantly
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
          >
            EscapeHer utilizes state-of-the-art AI routing, real-time audio analysis, instant network broadcasting, and live escape mapping to deliver immediate response when seconds count.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-16"
          >
            <Link
              href="/danger-mode"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold h-14 px-8 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] border-0 flex items-center justify-center gap-3 transition-all duration-300"
              )}
            >
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              ACTIVATE DANGER MODE
            </Link>

            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-zinc-800 bg-zinc-950/60 backdrop-blur-md text-zinc-100 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-700 h-14 px-8 rounded-xl flex items-center justify-center gap-2"
              )}
            >
              Enter Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          {/* Quick Metrics/Indicators */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-t border-zinc-900 pt-10 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">0.4s</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Alert dispatch</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">100%</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1">End-to-End Encrypted</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">AI-Powered</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Escape Routing</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">Socket.IO</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Real-time Sync</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Animated Emergency Pulse Elements */}
      <div className="absolute right-10 bottom-10 hidden lg:block z-0 opacity-40">
        <div className="relative flex items-center justify-center">
          <motion.div
            variants={alertRingVariants}
            animate="animate"
            className="absolute size-36 rounded-full border border-red-500/40 bg-red-500/5"
          />
          <motion.div
            variants={alertRingVariants}
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute size-56 rounded-full border border-red-600/30 bg-transparent"
          />
          <div className="size-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/50">
            <ShieldAlert className="size-8 text-white animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
