"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { CloudGuide } from "./CloudGuide";
import { motion, type Variants } from "framer-motion";
import { Laptop, Users, ShieldAlert, Plus, ArrowRight } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const Services: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].services;
  const cloudMsg = translations[language].cloud.services;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const servicesList = [
    {
      id: "online",
      icon: <Laptop size={20} />,
      title: t.online.title,
      desc: t.online.desc,
      features: t.online.features,
      tag: "GLOBAL",
      gradient: "from-[#38BDF8] to-[#4996D2]",
      mesh: "rgba(56, 189, 248, 0.3)",
    },
    {
      id: "inPerson",
      icon: <Users size={20} />,
      title: t.inPerson.title,
      desc: t.inPerson.desc,
      features: t.inPerson.features,
      tag: "CAIRO",
      gradient: "from-[#4996D2] to-[#072244]",
      mesh: "rgba(73, 150, 210, 0.3)",
    },
    {
      id: "parents",
      icon: <ShieldAlert size={20} />,
      title: t.parents.title,
      desc: t.parents.desc,
      features: t.parents.features,
      tag: "ADVISORY",
      gradient: "from-[#5B7186] to-[#04152e]",
      mesh: "rgba(91, 113, 134, 0.3)",
    },
  ];

  return (
    <section id="services" className="relative py-32 bg-[#04152e] overflow-hidden isolate">
      <CloudGuide message={cloudMsg} />

      {/* ── Cinematic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5B7186]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5B7186]/30 to-transparent" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40 bg-grid-masked" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-px w-4 bg-[#38BDF8]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8]">
              {language === "en" ? "Methodology" : "المنهجية"}
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

        {/* ── Cinematic Cards ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {servicesList.map((service, i) => (
            <motion.div
              key={service.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group overflow-hidden rounded-3xl bg-[#06060A] border border-white/10 p-8 shadow-card-deep flex flex-col h-full"
            >
              {/* Rotating mesh background */}
              <div 
                className={`absolute -inset-[100%] animate-mesh-spin opacity-0 transition-opacity duration-1000 ${hoveredCard === service.id ? 'opacity-100' : ''}`} 
                style={{ background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, ${service.mesh} 180deg, transparent 360deg)`, filter: 'blur(40px)' }} 
              />
              <div className="absolute inset-0 bg-[#06060A]/80 backdrop-blur-xl" />

              {/* Top animated progress bar */}
              <div className="absolute top-0 inset-x-4 h-[2px] overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className={`h-full bg-gradient-to-r ${service.gradient}`}
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: hoveredCard === service.id ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white ${hoveredCard === service.id ? 'shadow-glow-blue-sm text-[#38BDF8]' : ''} transition-all duration-500`}>
                    {service.icon}
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5B7186] bg-white/5 px-2 py-1 rounded-full border border-white/5">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-[#5B7186] text-sm leading-relaxed mb-8 flex-grow">
                  {service.desc}
                </p>

                {/* Feature List */}
                <div className="space-y-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Plus size={14} className="text-[#38BDF8] shrink-0 mt-0.5 opacity-70" />
                      <span className="text-sm text-[#e8ecf0]/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Footer action */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5B7186] group-hover:text-[#38BDF8] transition-colors">
                  <span>{language === "en" ? "Explore Program" : "استكشف البرنامج"}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Inset ring overlay */}
              <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-3xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
