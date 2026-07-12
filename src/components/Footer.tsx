"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion } from "framer-motion";
import { Phone, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const nav = translations[language].nav;

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/cmohamedezzat",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@cmohamedezzat",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@cmohamedezzat",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      ),
    },
  ];

  const navLinks = [
    { name: nav.about, href: "#about" },
    { name: nav.services, href: "#services" },
    { name: nav.results, href: "#results" },
    { name: nav.contact, href: "#contact" },
  ];

  return (
    <footer id="contact" className="relative bg-[#04152e] overflow-hidden isolate border-t border-white/5">
      {/* ── Cinematic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30 bg-grid-masked" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      {/* ── Top CTA Section ── */}
      <div className="relative border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-4 bg-[#38BDF8]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8]">
              {language === "en" ? "Ready to start?" : "جاهز للبدء؟"}
            </span>
            <span className="h-px w-4 bg-[#38BDF8]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight text-glow-blue-soft"
          >
            {t.headline}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="https://wa.me/201271527304"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white/5 border border-[#38BDF8]/30 px-10 py-5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-[#38BDF8]/60 shadow-glow-blue-sm hover:shadow-glow-blue"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#38BDF8]/0 via-[#38BDF8]/10 to-[#38BDF8]/0 opacity-0 group-hover:opacity-100 transition-opacity animate-scanline" />
              <Phone size={18} />
              {t.cta}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[#5B7186]">
              <span className="h-px w-6 bg-[#5B7186]/30" />
              <span>{language === "en" ? "or WhatsApp" : "أو واتساب"}: +201271527304</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-16 items-start">
          
          {/* Brand */}
          <div>
            <a href="#home" className="flex items-center gap-3 mb-6 group">
              <span className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Mohamed Ezzat Logo"
                  width={150}
                  height={82}
                  className="object-contain"
                />
              </span>
            </a>
            <p className="font-mono text-[11px] leading-relaxed text-[#5B7186] uppercase tracking-[0.1em] max-w-xs">
              {language === "en"
                ? "Science-backed Strength & Conditioning coaching for competitive swimmers."
                : "تدريب بدني مبني على أسس علمية للسباحين التنافسيين."}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-mono text-[10px] uppercase tracking-[0.2em] mb-6">
              {language === "en" ? "INDEX" : "الفهرس"}
            </h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[#5B7186] hover:text-[#38BDF8] transition-colors duration-300 text-sm font-medium flex items-center gap-3 group"
                  >
                    <span className="w-4 h-px bg-[#5B7186]/30 group-hover:bg-[#38BDF8] group-hover:w-6 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-mono text-[10px] uppercase tracking-[0.2em] mb-6">
              {language === "en" ? "NETWORK" : "الشبكة"}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#06060A] border border-white/10 flex items-center justify-center text-[#5B7186] hover:text-[#38BDF8] hover:border-[#38BDF8]/30 shadow-card-deep hover:shadow-glow-blue-sm transition-all duration-300 relative group"
                  aria-label={social.name}
                >
                  {social.icon}
                  <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#5B7186]">
            © {new Date().getFullYear()} MOHAMED EZZAT. {t.rights}
            <a href="/login" className="ml-4 hover:text-white transition-colors">Admin Access</a>
          </p>
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            {language === "en" ? "ACCEPTING NEW ATHLETES" : "قبول رياضيين جدد"}
          </div>
        </div>
      </div>
    </footer>
  );
};
