"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type ResultsClientProps = {
  results: any[];
};

export default function ResultsClient({ results }: ResultsClientProps) {
  const { language } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-32 pb-24 bg-[#06060A] relative isolate">
        {/* Background Effects */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-grid-masked" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              {language === 'en' ? 'Client Success Stories' : 'قصص نجاح المشتركين'}
            </h1>
            <p className="text-lg text-[#5B7186] max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Real athletes. Real results. See how our science-based dryland training translates to faster swimming.'
                : 'رياضيون حقيقيون. نتائج حقيقية. شاهد كيف يُترجم التدريب البدني المبني على العلم إلى سباحة أسرع.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((result) => (
              <div 
                key={result.id}
                className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl p-8 shadow-card-deep flex flex-col items-center text-center group hover:border-[#38BDF8]/30 transition-all duration-300"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-[#38BDF8]/20 group-hover:border-[#38BDF8] transition-colors relative">
                  <img src={result.image_url} alt={result.client_name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">{result.client_name}</h4>
                <p className="text-[#38BDF8] font-bold text-xl leading-tight">{result.achievement}</p>
              </div>
            ))}
            
            {results.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 text-[#5B7186]">
                {language === 'en' ? 'More results coming soon.' : 'المزيد من النتائج قريباً.'}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
