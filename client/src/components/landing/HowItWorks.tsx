"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Navigation, Radio } from "lucide-react";

interface StepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function Step({ number, icon, title, description, index }: StepProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring" }}
      className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative"
    >
      <style>{`
        @keyframes eh-scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .scanner-beam {
          animation: eh-scan 3s ease-in-out infinite;
        }
      `}</style>

      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
        <span className="text-sm font-bold text-red-500 tracking-widest uppercase mb-2">
          Step {number}
        </span>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-zinc-400 leading-relaxed max-w-lg">{description}</p>
      </div>

      <div className="relative flex items-center justify-center order-1 md:order-2">
        <div className="absolute size-28 rounded-full bg-red-600/10 blur-xl pointer-events-none" />
        {/* Pulsing outer guard ring */}
        <div className="absolute -inset-2 rounded-3xl border border-red-500/10 animate-pulse pointer-events-none" />
        <div className="size-20 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center text-red-500 z-10 relative overflow-hidden backdrop-blur-sm">
          {/* Laser scanning beam */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent scanner-beam pointer-events-none" />
          {icon}
          <div className="absolute -top-2 -right-2 size-7 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] border-2 border-zinc-950">
            {number}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <Radio className="size-8" />,
      title: "Activate Sentinel System",
      description: "Log into the app and keep it on alert. Use the Stealth mode configuration if you need the application window to look hidden or disguised as a system widget.",
    },
    {
      number: "02",
      icon: <MapPin className="size-8" />,
      title: "Trigger Alert",
      description: "In case of emergency, squeeze your phone, scream the personalized voice-trigger keywords, or press the red SOS trigger button once to start immediate broadcasting.",
    },
    {
      number: "03",
      icon: <Navigation className="size-8" />,
      title: "AI Escape Guideline & Dispatch",
      description: "Our backend updates emergency responders instantly via WebSockets while generating a secure real-time navigation overlay guiding you away from dangerous zones.",
    },
    {
      number: "04",
      icon: <ShieldCheck className="size-8" />,
      title: "Safe Evacuation & Check-in",
      description: "Once safe, enter your emergency PIN to resolve the alert. A dynamic check-in sequence updates your contacts to confirm your safety status.",
    },
  ];

  return (
    <section className="py-24 bg-black relative border-t border-zinc-900 px-4">
      {/* Visual Connector Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-zinc-800 to-transparent hidden md:block" />

      <div className="container max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            How EscapeHer Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-400 text-lg"
          >
            Four simplified stages built on rapid fail-safe actions.
          </motion.p>
        </div>

        <div className="flex flex-col gap-20">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
