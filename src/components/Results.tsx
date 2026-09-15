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

type ResultsProps = {
  clientResults?: any[];
};

export const Results: React.FC<ResultsProps> = ({ clientResults = [] }) => {
  const { language } = useLanguage();
  const t = translations[language].results;
  const cloudMsg = translations[language].cloud.results;

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
            <span className={`text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] ${language === 'en' ? 'font-mono' : 'font-bold'}`}>
              {language === "en" ? "Performance Areas" : "مجالات الأداء"}
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

        {/* ── Cinematic Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {t.areas.map((area, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-8 shadow-card-deep hover:border-[#38BDF8]/30 transition-all duration-500 flex flex-col h-full text-center md:text-left rtl:md:text-right"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                    <TrendingDown size={24} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">
                  {area.title}
                </h3>
                
                <p className="text-[#e8ecf0]/70 text-base leading-relaxed">
                  {area.desc}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-3xl" />
            </motion.div>
          ))}
        </div>

        {/* ── Dynamic Client Results ── */}
        {clientResults.length > 0 && (
          <div className="mt-32 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                {language === 'en' ? 'Client Success Stories' : 'قصص نجاح المشتركين'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientResults.slice(0, 3).map((result, idx) => (
                <motion.div 
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl p-6 shadow-card-deep flex flex-col items-center text-center group hover:border-[#38BDF8]/30 transition-all duration-300"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-[#38BDF8]/20 group-hover:border-[#38BDF8] transition-colors relative">
                    <img src={result.image_url} alt={result.client_name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{result.client_name}</h4>
                  <p className="text-[#38BDF8] font-bold text-lg leading-tight">{result.achievement}</p>
                </motion.div>
              ))}
            </div>
            
            {clientResults.length > 3 && (
              <div className="mt-12 text-center">
                <a href="/results" className="inline-flex items-center gap-2 text-[#38BDF8] hover:text-white font-bold transition-colors">
                  {language === 'en' ? 'See All Results' : 'مشاهدة كل النتائج'} <ChevronRight size={16} />
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Final Conversion CTA ── */}
        <div className="mt-24 text-center flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-6">{language === 'en' ? 'Ready to elevate your swimming performance?' : 'هل أنت مستعد لرفع مستوى أداءك في السباحة؟'}</h3>
            <a
              href="/apply"
              className="inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#38BDF8] px-8 py-4.5 text-sm font-black text-[#06060A] transition-all hover:bg-[#38BDF8]/90 shadow-glow-blue"
            >
              {language === 'en' ? 'Apply for Coaching' : 'قدم طلب تدريب'}
            </a>
        </div>

      </div>
    </section>
  );
};
