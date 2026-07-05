"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].nav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.about, href: "#about" },
    { name: t.services, href: "#services" },
    { name: t.results, href: "#results" },
    { name: t.contact, href: "#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 sm:top-5">
      <div className="max-w-4xl mx-auto px-4">
        <nav
          className={`mx-auto flex h-20 items-center justify-between gap-3 rounded-full border px-3 transition-all duration-700 sm:h-24 sm:px-6 ${
            isScrolled
              ? "border-[#5B7186]/20 bg-[#06060A]/80 backdrop-blur-xl shadow-glow-blue-sm"
              : "border-transparent bg-transparent"
          }`}
        >
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 ps-1 group">
            <span className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Mohamed Ezzat Logo"
                width={160}
                height={87}
                className="object-contain"
              />
            </span>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="rounded-full px-3.5 py-1.5 text-sm text-[#e8ecf0]/70 transition-colors hover:text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleLanguage}
              type="button"
              aria-label="Switch Language"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#5B7186]/30 bg-white/5 px-3 text-[11px] font-bold uppercase tracking-wider text-[#e8ecf0] transition-colors hover:border-[#38BDF8] hover:text-white"
            >
              <Globe size={14} />
              <span>{language === "en" ? "عربي" : "EN"}</span>
            </button>
            <a
              href="#contact"
              className="hidden items-center gap-1.5 rounded-full border border-[#5B7186]/40 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 sm:inline-flex sm:text-sm shadow-glow-blue-sm hover:shadow-glow-blue"
            >
              {t.book}
            </a>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#5B7186]/30 bg-white/5 text-white md:hidden hover:border-[#38BDF8]"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 bg-[#06060A]/95 backdrop-blur-xl border border-[#5B7186]/30 rounded-2xl overflow-hidden md:hidden shadow-card-deep"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 font-medium px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white/10 border border-[#5B7186]/40 text-white text-center px-4 py-3 rounded-xl font-bold mt-2 shadow-glow-blue-sm"
              >
                {t.book}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
