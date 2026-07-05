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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setIsSubmitted(true);
          setEmail("");
        }
      } catch (error) {
        console.error("Submission failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
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
              {t.headline}
            </h2>
            <p className="text-[#e8ecf0]/80 text-lg leading-relaxed mb-10">
              {t.subtext}
            </p>

            {/* Form */}
            <div className="max-w-md mx-auto">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full bg-[#06060A]/80 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-[#5B7186] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/30 transition-all font-mono text-sm"
                      />
                      <div className="absolute inset-0 rounded-2xl ring-inset-white pointer-events-none" />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full relative group overflow-hidden rounded-2xl bg-white/5 border border-[#38BDF8]/30 py-4 font-bold text-white text-sm tracking-wide transition-all hover:bg-white/10 hover:border-[#38BDF8]/60 shadow-glow-blue-sm hover:shadow-glow-blue flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#38BDF8]/0 via-[#38BDF8]/10 to-[#38BDF8]/0 opacity-0 group-hover:opacity-100 transition-opacity animate-scanline" />
                      <Download size={16} />
                      {isLoading ? (language === "en" ? "Sending..." : "جاري الإرسال...") : t.cta}
                    </motion.button>
                    
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#5B7186] mt-2">
                      {language === "en" ? "SECURE · NO SPAM" : "آمن · بدون إزعاج"}
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#06060A]/80 rounded-2xl border border-[#38BDF8]/30 p-10 text-center shadow-glow-blue-sm"
                  >
                    <CheckCircle size={48} className="text-[#38BDF8] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                    <h3 className="text-2xl font-black text-white mb-2">{t.success}</h3>
                    <p className="text-[#5B7186] font-mono text-[10px] uppercase tracking-widest">
                      {language === "en" ? "LINK DISPATCHED" : "تم الإرسال"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-[2rem]" />
        </motion.div>
      </div>
    </section>
  );
};
