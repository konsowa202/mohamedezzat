"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle } from "lucide-react";

export const LeadMagnet: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].leadMagnet;
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/resources";
  };

  return (
    <section className="relative py-32 bg-[#06060A] overflow-hidden isolate">
      {/* ── Cinematic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 bg-grid-masked" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-[#0a2d54]/30 border border-[#38BDF8]/20 p-8 md:p-16 shadow-card-deep"
        >
          {/* Decorative elements inside card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-float-slow" />
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-[#38BDF8]/10 text-[#38BDF8] font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 border border-[#38BDF8]/30 shadow-glow-blue-sm">
              <Download size={12} />
              {language === "en" ? "FREE RESOURCE" : "مصدر مجاني"}
            </span>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight text-glow-blue-soft">
              Access the Coaching Resources Library
            </h2>
            <p className="text-[#e8ecf0]/80 text-lg leading-relaxed mb-10">
              Download proven training protocols, checklists, and guides designed specifically to improve swimming performance.
            </p>

            {/* Form */}
            <div className="max-w-md mx-auto">
                <a
                  href="/resources"
                  className="w-full relative group overflow-hidden rounded-2xl bg-[#38BDF8] border border-[#38BDF8]/30 py-4 font-bold text-[#06060A] text-sm tracking-wide transition-all hover:bg-[#38BDF8]/90 shadow-glow-blue flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  {language === "en" ? "Browse Library" : "تصفح المكتبة"}
                </a>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-[2rem]" />
        </motion.div>
      </div>
    </section>
  );
};
