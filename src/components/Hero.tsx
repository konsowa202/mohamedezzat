"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion } from "framer-motion";
import { Trophy, Video, Calendar } from "lucide-react";

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  // Use flagcdn.com SVG vector images to support Windows OS cleanly without pixelation
  const countries = [
    { flagUrl: "https://flagcdn.com/us.svg", code: "USA" },
    { flagUrl: "https://flagcdn.com/sa.svg", code: "KSA" },
    { flagUrl: "https://flagcdn.com/eg.svg", code: "EGY" },
    { flagUrl: "https://flagcdn.com/qa.svg", code: "QAT" },
    { flagUrl: "https://flagcdn.com/ae.svg", code: "UAE" },
  ];

  return (
    <section id="home" className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden pt-24 md:pt-28 pb-6">
      
      {/* ── Background Video & Cinematic Effects ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Background Swimming Video */}
        <video 
          src="/bg-swim.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />

        {/* Ambient Dark Overlays & Glow Orbs */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06060A]/95 via-[#06060A]/70 to-[#06060A]" />
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[#38BDF8]/15 blur-[140px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#4996D2]/15 blur-[140px] animate-float-slow" style={{ animationDelay: "3s" }} />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 bg-grid-masked" />
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        
        {/* Film grain noise */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      {/* ── Main Hero Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-grow py-8">
        
        {/* ── Left Column: Biography & Value Prop ── */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left rtl:lg:text-right items-center lg:items-start">
          
          {/* Much Larger Floating Avatar Badge (No card/frame background, larger image, larger name, no green dot) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-6 mb-10"
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#38BDF8] shadow-glow-blue">
              <Image 
                src="/avatar.jpg" 
                alt="Mohamed Ezzat Avatar" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col items-start text-left rtl:text-right">
              <span className="font-mono text-xs sm:text-sm text-[#38BDF8] uppercase tracking-wider font-extrabold mb-1">
                {language === "en" ? "Head S&C Coach" : "مدرب الأداء البدني الأول"}
              </span>
              <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight text-glow-blue-soft leading-none">
                {language === "en" ? "MOHAMED EZZAT" : "محمد عزت"}
              </span>
            </div>
          </motion.div>

          {/* Headline: Dryland Strength Coach for Swimmers */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 tracking-tight leading-[1.05] mb-6 font-display"
          >
            {t.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-[#5B7186] mb-10 max-w-2xl font-medium leading-relaxed"
          >
            {t.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="/apply"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-[#38BDF8] px-8 py-4.5 text-sm font-black text-[#06060A] transition-all hover:bg-[#38BDF8]/90 shadow-glow-blue"
            >
              <Calendar size={16} />
              {t.cta}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>

            <a
              href="#results"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              <Video size={16} />
              {language === "en" ? "See Results" : "مشاهدة النتائج"}
            </a>
          </motion.div>
        </div>

        {/* ── Right Column: High Performance Visual ── */}
        <div className="lg:col-span-5 flex justify-center w-full relative">
          
          {/* Floating Stat Badge 1 */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-1/4 z-20 hidden sm:flex items-center gap-3 bg-[#06060A]/90 border border-white/10 rounded-2xl p-4 shadow-card-deep backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] border border-[#38BDF8]/20">
              <Trophy size={16} />
            </div>
            <div>
              <div className="text-xs font-black text-white">ELITE RESULTS</div>
              <div className="font-mono text-[9px] text-[#5B7186] uppercase tracking-wider">Dryland S&C</div>
            </div>
          </motion.div>

          {/* High Quality Swimming Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[400px] aspect-[4/5] relative rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-white/5 bg-white/5 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#38BDF8]/20 to-transparent mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Trophy size={80} className="text-[#38BDF8]/20" />
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Full Screen Width Countries Infinity Marquee Banner (Transition to next section) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full overflow-hidden relative py-8 bg-[#06060A]/90 border-t border-b border-white/5 mt-4 backdrop-blur-md z-10"
      >
        <div className="flex w-max gap-16 animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-16 font-mono text-lg sm:text-xl font-bold tracking-[0.2em] items-center shrink-0 text-white/80">
              {countries.map((country, idx) => (
                <span key={idx} className="flex items-center gap-4">
                  <img 
                    src={country.flagUrl} 
                    alt={country.code} 
                    className="w-8 h-auto object-contain rounded-sm shadow-sm"
                  />
                  <span>{country.code}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
};
