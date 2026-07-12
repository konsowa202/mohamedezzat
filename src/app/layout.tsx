import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "Mohamed Ezzat | Swim S&C Coaching",
  description: "Science-backed Strength & Conditioning coaching for competitive swimmers and finswimmers.",
};

import { VisitTracker } from "@/components/VisitTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-paper)] text-[var(--color-navy)] font-sans">
        <VisitTracker />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
