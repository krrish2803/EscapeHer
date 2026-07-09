"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-colors hover:bg-[var(--eh-mist-50)] active:scale-[0.98]"
      >
        {/* Avatar */}
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: "var(--eh-teal-100)", color: "var(--eh-teal-700)" }}
        >
          {initials}
        </span>
        <span className="hidden sm:block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          {user?.name ?? "Account"}
        </span>
        <ChevronDown
          size={14}
          color="var(--eh-ink-600)"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden shadow-lg z-50"
          style={{
            background: "var(--eh-surface, #fff)",
            border: "1px solid var(--eh-mist-200)",
          }}
          role="menu"
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--eh-mist-200)" }}>
            <p className="text-sm font-semibold truncate" style={{ color: "var(--eh-ink-900)" }}>
              {user?.name ?? "User"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--eh-ink-600)" }}>
              {user?.email ?? ""}
            </p>
          </div>
          <div className="p-1.5 space-y-0.5">
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[var(--eh-mist-50)]"
              style={{ color: "var(--eh-ink-900)" }}
              onClick={() => setOpen(false)}
            >
              <User size={15} color="var(--eh-ink-600)" />
              Profile
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[var(--eh-mist-50)]"
              style={{ color: "var(--eh-ink-900)" }}
              onClick={() => setOpen(false)}
            >
              <Settings size={15} color="var(--eh-ink-600)" />
              Settings
            </Link>
          </div>
          <div className="p-1.5" style={{ borderTop: "1px solid var(--eh-mist-200)" }}>
            <button
              type="button"
              role="menuitem"
              onClick={async () => { setOpen(false); await signOut(); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[var(--eh-mist-50)]"
              style={{ color: "var(--eh-ink-900)" }}
            >
              <LogOut size={15} color="var(--eh-ink-600)" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
