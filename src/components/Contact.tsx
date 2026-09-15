"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Phone, MapPin } from "lucide-react";

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#06060A]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-grid-masked" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#38BDF8]/5 blur-[120px] rounded-full" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Mail size={14} />
            {language === "en" ? "Get in Touch" : "تواصل معنا"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 font-display tracking-tight"
          >
            {language === "en" ? "Ready to Transform Your Performance?" : "مستعد لتغيير مستواك الرياضي؟"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#5B7186] text-lg"
          >
            {language === "en" 
              ? "Book a consultation call or drop a message to discuss how we can help you achieve your goals."
              : "احجز مكالمة استشارية أو أرسل رسالة لمناقشة كيف يمكننا مساعدتك في تحقيق أهدافك."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6">
                {language === "en" ? "Contact Information" : "معلومات التواصل"}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[#5B7186] mb-1">{language === "en" ? "Email Address" : "البريد الإلكتروني"}</p>
                    <a href="mailto:cmohamedezzat@gmail.com" className="text-white font-medium hover:text-[#38BDF8] transition-colors">
                      cmohamedezzat@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[#5B7186] mb-1">{language === "en" ? "Phone Number" : "رقم الهاتف"}</p>
                    <a href="tel:+201271527304" className="text-white font-medium hover:text-[#38BDF8] transition-colors" dir="ltr">
                      +20 12 71527304
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[#5B7186] mb-1">{language === "en" ? "Location" : "الموقع"}</p>
                    <span className="text-white font-medium">
                      {language === "en" ? "Cairo, Egypt / Online Coaching Worldwide" : "القاهرة، مصر / تدريب أونلاين حول العالم"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-3xl p-8 backdrop-blur-sm text-center">
               <h3 className="text-lg font-bold text-[#38BDF8] mb-3">
                 {language === "en" ? "Prefer a direct call?" : "تفضل مكالمة مباشرة؟"}
               </h3>
               <p className="text-[#e8ecf0] text-sm mb-6">
                 {language === "en" ? "Schedule a free 15-minute discovery call to see if we're a good fit." : "احجز مكالمة استكشافية مجانية لمدة 15 دقيقة لنرى كيف يمكننا مساعدتك."}
               </p>
               <a href="/apply" className="inline-block w-full bg-[#38BDF8] text-[#06060A] font-bold py-3 px-6 rounded-xl hover:bg-[#38BDF8]/90 transition-colors shadow-glow-blue-sm">
                 {language === "en" ? "Book Discovery Call" : "احجز مكالمة استكشافية"}
               </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a2d54]/20 border border-[#38BDF8]/20 rounded-3xl p-8 shadow-card-deep backdrop-blur-md relative overflow-hidden"
          >
            {isSuccess && (
              <div className="absolute inset-0 bg-[#06060A]/90 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === "en" ? "Message Sent!" : "تم إرسال الرسالة!"}
                </h3>
                <p className="text-[#5B7186]">
                  {language === "en" ? "We'll get back to you within 24 hours." : "سنقوم بالرد عليك خلال 24 ساعة."}
                </p>
              </div>
            )}
            
            <h3 className="text-xl font-bold text-white mb-6">
              {language === "en" ? "Send a Message" : "أرسل رسالة"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5B7186] uppercase">{language === "en" ? "Name" : "الاسم"}</label>
                  <input type="text" required className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5B7186] uppercase">{language === "en" ? "Email" : "البريد"}</label>
                  <input type="email" required className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5B7186] uppercase">{language === "en" ? "Subject" : "الموضوع"}</label>
                <input type="text" required className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5B7186] uppercase">{language === "en" ? "Message" : "الرسالة"}</label>
                <textarea required rows={4} className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-[#38BDF8] transition-colors" />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-[#06060A] font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">{language === "en" ? "Sending..." : "جاري الإرسال..."}</span>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    {language === "en" ? "Send Message" : "إرسال الرسالة"}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
