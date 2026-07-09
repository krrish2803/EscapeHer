import type { Metadata } from "next";
import React from "react";
import { Manrope, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider as ThemeContextProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

/* ─── Fonts ────────────────────────────────────────────────────────────────── */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "EscapeHer - AI-Assisted Women's Emergency Safety Net",
  description: "Advanced emergency safety net utilizing real-time AI routing, voice Sentinel keywords, dynamic stealth modes, and verified guardian dispatch networks.",
};

/* ─── Root Layout ──────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col font-sans selection:bg-rose-500 selection:text-white"
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ThemeProvider>
          </ThemeContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

