"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  /** Optional id for aria-labelledby from parent sections */
  id?: string;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  className = "",
  id,
}: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h1
          id={id}
          className="text-xl font-bold leading-tight"
          style={{
            color: "var(--eh-ink-900)",
            fontFamily: "var(--eh-font-display)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm" style={{ color: "var(--eh-ink-600)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
