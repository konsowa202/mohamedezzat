"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { CloudGuide } from "./CloudGuide";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, TrendingDown } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    },
  }),
};

export const Results: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].results;
  const cloudMsg = translations[language].cloud.results;
  const [activeCard, setActiveCard] = useState(0);

  const nextCard = () => setActiveCard((prev: number) => (prev + 1) % t.athletes.length);
  const prevCard = () => setActiveCard((prev: number) => (prev - 1 + t.athletes.length) % t.athletes.length);

  return (
    <section id="results" className="relative py-32 bg-[#06060A] overflow-hidden isolate">
      <CloudGuide message={cloudMsg} position="left" />

      {/* ── Cinematic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#38BDF8]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 bg-grid-masked" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-px w-4 bg-[#38BDF8]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8]">
              {language === "en" ? "Track Record" : "سجل الأداء"}
            </span>
            <span className="h-px w-4 bg-[#38BDF8]" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
          >
            {t.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#5B7186] max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* ── Desktop: Cinematic Grid ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.athletes.map((athlete, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-6 shadow-card-deep hover:border-[#38BDF8]/30 transition-all duration-500 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Meta */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#5B7186]">
                    RESULTS · {String(i + 1).padStart(2, '0')}
                  </span>
                  <TrendingDown size={14} className="text-[#38BDF8]" />
                </div>

                {/* Massive Stat */}
                <div className="mb-8">
                  <div className="font-display text-5xl font-black text-white leading-none tracking-tight mb-2 text-glow-blue-soft">
                    {athlete.timeDrop}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5B7186]">
                    TIME DROP · {athlete.event}
                  </div>
                </div>

                {/* Times */}
                <div className="flex items-center gap-3 font-mono text-xs mb-8 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-white/40 line-through decoration-red-500/50">{athlete.beforeTime}</span>
                  <span className="text-[#5B7186]">→</span>
                  <span className="text-[#38BDF8] font-bold">{athlete.afterTime}</span>
                </div>

                {/* Quote */}
                <div className="relative flex-grow border-t border-white/10 pt-6 mt-auto">
                  <Quote size={12} className="text-[#38BDF8]/50 absolute top-4 left-0" />
                  <p className="text-[#e8ecf0]/70 text-sm leading-relaxed italic pl-5">
                    "{athlete.quote}"
                  </p>
                  <div className="mt-4 flex items-center gap-2 pl-5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                      {athlete.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-3xl" />
            </motion.div>
          ))}
        </div>

        {/* ── Mobile: Cinematic Carousel ── */}
        <div className="md:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-3xl bg-[#0a2d54]/20 border border-[#38BDF8]/20 p-8 shadow-card-deep"
              >
                {(() => {
                  const athlete = t.athletes[activeCard];
                  return (
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#5B7186]">
                          RESULTS · {String(activeCard + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="font-display text-6xl font-black text-white leading-none tracking-tight mb-2 text-glow-blue-soft">
                        {athlete.timeDrop}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5B7186] mb-8">
                        TIME DROP · {athlete.event}
                      </div>
                      
                      <div className="flex items-center gap-3 font-mono text-sm mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-white/40 line-through decoration-red-500/50">{athlete.beforeTime}</span>
                        <span className="text-[#5B7186]">→</span>
                        <span className="text-[#38BDF8] font-bold">{athlete.afterTime}</span>
                      </div>

                      <div className="relative pt-6 border-t border-white/10">
                        <p className="text-[#e8ecf0]/70 text-base leading-relaxed italic">
                          "{athlete.quote}"
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-white">
                            {athlete.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-3xl" />
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button onClick={prevCard} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {t.athletes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === activeCard ? "bg-[#38BDF8] w-6" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <button onClick={nextCard} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Final Conversion CTA ── */}
        <div className="mt-20 text-center flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-6">Want similar progress for your swimmer?</h3>
            <a
              href="/apply"
              className="inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#38BDF8] px-8 py-4.5 text-sm font-black text-[#06060A] transition-all hover:bg-[#38BDF8]/90 shadow-glow-blue"
            >
              Get a Free Performance Assessment
            </a>
        </div>

      </div>
    </section>
  );
};
