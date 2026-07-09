"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Map, MessageSquareWarning, Mic, Eye, Users } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative group p-6 rounded-2xl bg-zinc-950/30 border border-zinc-900/60 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.05)] transition-all duration-300 backdrop-blur-md overflow-hidden"
    >
      {/* Cybersecurity Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* High-tech Status LED */}
      <div className="absolute top-5 right-5 size-1.5 rounded-full bg-zinc-800 group-hover:bg-red-500 group-hover:shadow-[0_0_8px_#ef4444] transition-all duration-300" />

      <div className="relative z-10">
        <div className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500/10 group-hover:text-red-400 transition-all duration-300 mb-5">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const featuresList = [
    {
      icon: <Shield className="size-6" />,
      title: "One-Tap SOS Broadcast",
      description: "Instantly broadcast your live location, audio feed, and details to your trusted emergency contacts and active guardians in your vicinity.",
      delay: 0.1,
    },
    {
      icon: <Map className="size-6" />,
      title: "AI Escape Routing",
      description: "Real-time, dynamic route mapping. Generates paths to safe zones, well-lit public spaces, or police stations using active maps.",
      delay: 0.2,
    },
    {
      icon: <Mic className="size-6" />,
      title: "AI Audio Sentinel",
      description: "Continuous real-time voice analysis monitors for trigger keywords or signs of physical distress to invoke emergency protocols hands-free.",
      delay: 0.3,
    },
    {
      icon: <MessageSquareWarning className="size-6" />,
      title: "Stealth UI Layout",
      description: "Quick-switch mask interface instantly changes the app layout to look like a generic calculator, utility, or news application in seconds.",
      delay: 0.4,
    },
    {
      icon: <Users className="size-6" />,
      title: "Local Guardian Net",
      description: "Connect automatically with verified nearby volunteers and female safety units who can rush to assist when official services are far.",
      delay: 0.5,
    },
    {
      icon: <Eye className="size-6" />,
      title: "Socket.IO Live Sync",
      description: "Keeps a persistent, lag-free connection with dashboard monitors, sharing telemetry data, battery levels, and ambient threat indexes.",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden px-4">
      {/* Decorative Blur BG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-red-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Built to Protect, Designed to Save
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-400 text-lg"
          >
            Leveraging modern edge technologies to provide an bulletproof lifeline when every second counts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
