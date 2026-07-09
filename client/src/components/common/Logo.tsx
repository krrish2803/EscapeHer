"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mark" | "mono-white";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { height: 24, width: 90 },
  md: { height: 32, width: 120 },
  lg: { height: 44, width: 168 },
};

const VARIANT_SRC: Record<NonNullable<LogoProps["variant"]>, string> = {
  full: "/logo/logo-full.svg",
  mark: "/logo/icon-mark.svg",
  "mono-white": "/logo/logo-mono-white.svg",
};

export default function Logo({
  variant = "full",
  size = "md",
  className = "",
}: LogoProps) {
  const { height, width } = SIZE_MAP[size];
  const isMarkOnly = variant === "mark";

  return (
    <Image
      src={VARIANT_SRC[variant]}
      alt="EscapeHer"
      width={isMarkOnly ? height : width}
      height={height}
      priority
      className={className}
    />
  );
}
