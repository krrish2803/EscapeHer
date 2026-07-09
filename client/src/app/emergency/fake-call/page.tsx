"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, PhoneOff, User, Volume2, Shield, MicOff, Video, Plus, Grid, Users 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FakeCallPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"incoming" | "active" | "ended">("incoming");
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Timer for active call
  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDecline = () => {
    setStatus("ended");
    setTimeout(() => {
      router.back();
    }, 1200);
  };

  const handleAccept = () => {
    setStatus("active");
  };

  const callControlButtons = [
    { icon: isMuted ? MicOff : MicOff, label: "mute", active: isMuted, onClick: () => setIsMuted(!isMuted) },
    { icon: Grid, label: "keypad", active: false },
    { icon: Volume2, label: "speaker", active: isSpeaker, onClick: () => setIsSpeaker(!isSpeaker) },
    { icon: Plus, label: "add call", active: false },
    { icon: Video, label: "FaceTime", active: false },
    { icon: Users, label: "contacts", active: false },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 md:p-8 font-sans selection:bg-red-500 selection:text-white">
      {/* Top logo overlay */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 opacity-50 bg-zinc-900/40 border border-zinc-800/30 px-3.5 py-1.5 rounded-full">
          <Shield size={13} className="text-red-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest font-mono">EH_STEALTH_CALL</span>
        </div>
      </div>

      {/* Caller Info */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          {/* Avatar Ring */}
          <div className="h-28 w-28 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center shadow-2xl shadow-black/80 relative z-10 overflow-hidden">
            {/* Visual placeholder initials */}
            <User size={48} className="text-zinc-600" />
          </div>

          <AnimatePresence>
            {status === "incoming" && (
              <>
                <motion.span 
                  initial={{ opacity: 0.35, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-500/45 bg-emerald-500/5 z-0" 
                />
                <motion.span 
                  initial={{ opacity: 0.45, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-emerald-500/35 bg-emerald-500/5 z-0" 
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center space-y-2.5">
          <h1 className="text-2xl font-bold tracking-tight">Emergency Helpline</h1>
          <p className="text-sm font-medium text-zinc-400">
            {status === "incoming" && "Incoming voice call…"}
            {status === "active" && `Call Active — ${formatTime(seconds)}`}
            {status === "ended" && "Call ended"}
          </p>
        </div>
      </div>

      {/* Call Active Controls Grid */}
      <AnimatePresence>
        {status === "active" && (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="w-full max-w-xs mx-auto grid grid-cols-3 gap-y-6 gap-x-4 pb-8"
          >
            {callControlButtons.map((btn, index) => {
              const Icon = btn.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={btn.onClick}
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 border ${
                      btn.active 
                        ? "bg-white text-zinc-950 border-white" 
                        : "bg-white/10 hover:bg-white/15 text-white border-transparent"
                    }`}
                  >
                    <Icon size={20} />
                  </button>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{btn.label}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="pb-12 flex justify-center">
        {status === "incoming" ? (
          <div className="flex gap-12 md:gap-16">
            {/* Decline */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleDecline}
                aria-label="Decline Call"
                className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-red-950/65"
              >
                <PhoneOff size={24} className="text-white" />
              </button>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleAccept}
                aria-label="Accept Call"
                className="h-16 w-16 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-emerald-950/65 relative"
              >
                <span className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-ping" />
                <Phone size={24} className="text-white" />
              </button>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Accept</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2 items-center justify-center text-zinc-400 text-xs font-semibold bg-zinc-900/65 border border-zinc-800/40 rounded-full px-4.5 py-2">
              <Volume2 size={13} className="animate-pulse text-emerald-500" />
              <span>Simulated audio active</span>
            </div>
            {/* End Call */}
            <button
              type="button"
              onClick={handleDecline}
              aria-label="End Call"
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-red-950/65"
            >
              <PhoneOff size={24} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
