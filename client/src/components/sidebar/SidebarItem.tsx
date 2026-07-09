"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItemDef } from "./AppSidebar";

interface SidebarItemProps extends SidebarItemDef {
  onClick?: () => void;
}

export default function SidebarItem({ href, icon: Icon, label, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]"
      style={{
        background: active ? "var(--eh-teal-100)" : "transparent",
        color: active ? "var(--eh-teal-700)" : "var(--eh-ink-600)",
      }}
    >
      <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
      {label}
    </Link>
  );
}
