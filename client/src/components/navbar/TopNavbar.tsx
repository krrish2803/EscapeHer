"use client";

import React from "react";
import { Menu, ShieldAlert, Bell } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import ProfileMenu from "@/components/navbar/ProfileMenu";

interface TopNavbarProps {
  onMenuClick: () => void;
  /** Unread notification count — wired to Krrish's notification API */
  notificationCount?: number;
}

export default function TopNavbar({
  onMenuClick,
  notificationCount = 0,
}: TopNavbarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-[var(--eh-mist-200)] bg-[var(--eh-surface)]/85 backdrop-blur-md"
    >
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-controls="app-sidebar"
        className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[var(--eh-mist-50)] lg:hidden"
      >
        <Menu size={20} color="var(--eh-ink-900)" />
      </button>

      {/* Logo */}
      <div className="flex-1">
        <Logo variant="full" size="sm" />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* SOS quick-access */}
        <Link
          href="/danger-mode"
          aria-label="Quick SOS — go to Danger Mode"
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors active:scale-[0.98]"
          style={{ background: "var(--eh-danger-100)" }}
        >
          <ShieldAlert size={18} color="var(--eh-danger-600)" />
        </Link>

        {/* Notifications */}
        <button
          type="button"
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[var(--eh-mist-50)]"
        >
          <Bell size={18} color="var(--eh-ink-600)" />
          {notificationCount > 0 && (
            <span
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
              style={{ background: "var(--eh-spark-500)", color: "var(--eh-surface, #fff)" }}
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <ProfileMenu />
      </div>
    </header>
  );
}
