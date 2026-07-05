"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion, type Variants } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface VideoItem {
  title: string;
  views: string;
  platform: "youtube" | "instagram" | "tiktok";
  url: string;
  color: string;
  embedType: "instagram-iframe" | "local-video";
  videoSrc?: string;
}

export const ContentHub: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].contentHub;

  const videos: VideoItem[] = [
    {
      title: language === "en" ? "Dryland Strength Reel" : "فيديو القوة البدنية الجافة",
      views: "1.2M",
      platform: "instagram",
      url: "https://www.instagram.com/reel/DaQvUOus72P/",
      color: "rgba(217, 179, 255, 0.6)",
      embedType: "instagram-iframe",
    },
    {
      title: language === "en" ? "Explosive Starts & Technique" : "البدايات الانفجارية والتقنية",
      views: "850K",
      platform: "instagram",
      url: "https://www.instagram.com/cmohamedezzat/",
      color: "rgba(255, 181, 160, 0.6)",
      embedType: "local-video",
      videoSrc: "/bg-swim.mp4",
    },
    {
      title: language === "en" ? "TikTok Training Hub" : "منصة تدريب تيك توك",
      views: "2.4M",
      platform: "tiktok",
      url: "https://www.tiktok.com/@cmohamedezzat",
      color: "rgba(179, 229, 209, 0.6)",
      embedType: "local-video",
      videoSrc: "/bg-swim.mp4",
    },
  ];

  return (
    <section id="content" className="relative py-32 bg-[#04152e] overflow-hidden isolate">
      {/* ── Cinematic Background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#38BDF8]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#4996D2]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40 bg-grid-masked" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="mb-20 grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-[#38BDF8]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8]">
                {language === "en" ? "The Content Engine" : "محرك المحتوى"}
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              {t.title}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[#5B7186] text-lg sm:text-xl leading-relaxed border-l border-[#5B7186]/20 pl-6">
              {t.subtitle}
            </p>
          </motion.div>
        </div>

        {/* ── Interactive Video Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group aspect-[9/16] md:aspect-[4/5] relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#06060A] shadow-card-deep block"
            >
              {/* Actual Embedded Interactive Players */}
              {video.embedType === "instagram-iframe" ? (
                <iframe 
                  src="https://www.instagram.com/reel/DaQvUOus72P/embed" 
                  className="w-full h-full border-0 absolute inset-0 z-0"
                  allowFullScreen 
                  scrolling="no" 
                  frameBorder="0"
                  title={video.title}
                />
              ) : (
                <div className="w-full h-full absolute inset-0 z-0 bg-black">
                  <video 
                    src={video.videoSrc} 
                    className="w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    controls 
                  />
                </div>
              )}

              {/* Glowing Mesh Overlay (Visual border glow effect) */}
              <div className="absolute -inset-[50%] opacity-20 pointer-events-none z-10 transition-opacity duration-700" style={{ background: `radial-gradient(ellipse at 50% 50%, ${video.color} 0%, transparent 60%)`, filter: 'blur(30px)' }} />

              {/* Hover Details Card (Positioned on top, pointer-events-none to click video controls underneath) */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none">
                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-white/60 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-glow" />
                    {video.platform === 'instagram' ? 'INSTAGRAM' : 'TIKTOK'}
                  </span>
                  <span>{video.views} VIEWS</span>
                </div>
                <div className="font-display text-[15px] font-black leading-tight uppercase tracking-tight text-white">
                  {video.title}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[9px] font-medium text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
                  <span>@cmohamedezzat</span>
                </div>
              </div>

              {/* Inner ring overlay */}
              <div className="pointer-events-none absolute inset-0 ring-inset-white rounded-2xl z-20" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
