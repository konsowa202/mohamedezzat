"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { CloudGuide } from "./CloudGuide";
import { motion, type Variants } from "framer-motion";
import { GraduationCap, BookOpen, Target, Beaker, ChevronRight } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const About: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].about;
  const cloudMsg = translations[language].cloud.about;

  const stats = [
    { value: "50+", label: language === "en" ? "Athletes" : "رياضي", sub: "Trained" },
    { value: "4", label: language === "en" ? "Frameworks" : "أطر", sub: "Mastered" },
    { value: "BSc", label: language === "en" ? "Degree" : "درجة", sub: "Benha Univ." },
  ];

  return (
    <section id="about" className="relative py-32 bg-[#06060A] overflow-hidden isolate">
      <CloudGuide message={cloudMsg} />

      {/* ── Cinematic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-[120px] translate-x-1/3" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 bg-grid-masked" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="mb-20 grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-[#38BDF8]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8]">
                {language === "en" ? "The Foundation" : "الأساس"}
              </span>
            </motion.div>
            
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              {t.title}
            </motion.h2>
          </div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={2}
          >
            <p className="text-[#5B7186] text-lg sm:text-xl leading-relaxed border-l border-[#5B7186]/20 pl-6">
              {t.positioning}
            </p>
          </motion.div>
        </div>

        {/* ── Cinematic Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3 + i}
              className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 p-8 shadow-card-deep group hover:bg-white/[0.04] transition-colors"
            >
              <div className="absolute -inset-20 animate-mesh-spin opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ background: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.4), transparent 60%)" }} />
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="font-display text-5xl font-black text-white mb-2 text-glow-blue-soft transition-all">
                  {stat.value}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#e8ecf0]">{stat.label}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5B7186] mt-1">{stat.sub}</div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-inset-white" />
            </motion.div>
          ))}
        </div>

        {/* ── Credential Cards ── */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: GraduationCap, title: t.education, desc: t.educationDetail, tag: "ACADEMIC" },
            { icon: BookOpen, title: t.methodologies, desc: t.credentials, tag: "CERTIFIED" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={6 + i}
              className="relative overflow-hidden rounded-3xl bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-8 shadow-card-deep group hover:border-[#38BDF8]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#06060A] border border-white/10 flex items-center justify-center text-[#38BDF8] shadow-glow-blue-sm">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5B7186] mb-2">{item.tag}</div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#38BDF8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#5B7186] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-3xl" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
