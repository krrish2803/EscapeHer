"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  History,
  User,
  Settings,
  X,
} from "lucide-react";
import Logo from "@/components/common/Logo";

export interface SidebarItemDef {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: SidebarItemDef[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/danger-mode", icon: ShieldAlert, label: "Danger Mode" },
  { href: "/history", icon: History, label: "Incident History" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "color-mix(in srgb, var(--eh-ink-900) 35%, transparent)" }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="app-sidebar"
        aria-label="App navigation"
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          transition-transform duration-200 ease-out
          lg:static lg:translate-x-0 lg:z-auto
          border-r border-[var(--eh-mist-200)] bg-[var(--eh-surface)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + close */}
        <div
          className="flex items-center justify-between px-5 py-5 border-b border-[var(--eh-mist-200)]"
        >
          <Logo variant="full" size="lg" className="h-9 w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--eh-mist-50)]"
          >
            <X size={18} color="var(--eh-ink-600)" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3.5 px-4 py-3 text-sm font-semibold
                  transition-all duration-200 active:scale-[0.97]
                  ${active 
                    ? "bg-[var(--eh-teal-100)] text-[var(--eh-teal-700)] border-l-4 border-red-500 rounded-r-xl rounded-l-none" 
                    : "rounded-xl text-[var(--eh-ink-600)] hover:bg-[var(--eh-teal-100)]/15 hover:text-[var(--eh-teal-700)]"}
                `}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} className="shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Emergency button in sidebar */}
        <div className="p-4 border-t border-[var(--eh-mist-200)] bg-[var(--eh-surface)]">
          <Link
            href="/danger-mode"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] animate-pulse hover:animate-none hover:shadow-[0_0_20px_rgba(226,114,114,0.4)]"
            style={{ background: "var(--eh-danger-600)", color: "var(--eh-surface, #fff)" }}
            onClick={onClose}
          >
            <ShieldAlert size={16} />
            Danger Mode
          </Link>
        </div>
      </aside>
    </>
  );
}
