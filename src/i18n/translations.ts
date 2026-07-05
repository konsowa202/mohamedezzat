export type Language = "en" | "ar";

export const translations: Record<Language, {
  nav: {
    about: string;
    services: string;
    results: string;
    contact: string;
    book: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  about: {
    title: string;
    positioning: string;
    education: string;
    educationDetail: string;
    credentials: string;
    methodologies: string;
  };
  services: {
    title: string;
    subtitle: string;
    online: { title: string; desc: string; features: string[] };
    inPerson: { title: string; desc: string; features: string[] };
    parents: { title: string; desc: string; features: string[] };
  };
  results: {
    title: string;
    subtitle: string;
    athletes: {
      name: string;
      event: string;
      timeDrop: string;
      quote: string;
      beforeTime: string;
      afterTime: string;
    }[];
  };
  contentHub: {
    title: string;
    subtitle: string;
  };
  leadMagnet: {
    headline: string;
    subtext: string;
    cta: string;
    placeholder: string;
    success: string;
  };
  footer: {
    headline: string;
    cta: string;
    rights: string;
  };
  cloud: {
    hero: string;
    about: string;
    services: string;
    results: string;
  };
}> = {
  en: {
    nav: {
      about: "About",
      services: "Services",
      results: "Results",
      contact: "Contact",
      book: "Book a Consult",
    },
    hero: {
      headline: "Dryland Strength Coach for Swimmers",
      subheadline: "Faster Starts • Explosive Power • Faster Races",
      cta: "Book a Consult",
    },
    about: {
      title: "The Story",
      positioning: "Science-backed coaching in a market of unqualified coaches.",
      education: "Academic Foundations",
      educationDetail: "Degree from Benha University — combining academic rigor with real-world coaching application.",
      credentials: "Extensively trained in the advanced methodologies of EXOS XPS, IASST S&C, NASM-PES, and CSCS. Mohamed applies elite-level, science-backed principles from these frameworks to every athlete's program, ensuring results driven by proven biomechanics rather than guesswork.",
      methodologies: "Applied Methodologies",
    },
    services: {
      title: "Services",
      subtitle: "Tailored programs designed for peak aquatic performance",
      online: {
        title: "Online Coaching",
        desc: "Remote programming tailored specifically for competitive swimmers. Train with elite-level guidance from anywhere in the world.",
        features: ["Personalized training blocks", "Video analysis feedback", "Weekly check-ins", "Nutrition guidance"],
      },
      inPerson: {
        title: "In-Person Coaching",
        desc: "Hands-on deck and dryland training sessions for optimal performance gains and technique refinement.",
        features: ["1-on-1 sessions", "Club team training", "Dryland circuits", "Competition prep"],
      },
      parents: {
        title: "For Parents",
        desc: "Protecting young athletes: Mitigating the risks of early specialization and preventing burnout and injury through proper S&C.",
        features: ["Risk assessment", "Age-appropriate programs", "Injury prevention", "Long-term development"],
      },
    },
    results: {
      title: "Results & Proof",
      subtitle: "Real athletes. Real numbers. No guesswork.",
      athletes: [
        {
          name: "Mazen",
          event: "100m Freestyle",
          timeDrop: "-2.3s",
          quote: "Dropped 2.3 seconds off my 100m Free in just one macrocycle. The explosive power difference is unreal.",
          beforeTime: "58.4s",
          afterTime: "56.1s",
        },
        {
          name: "Yahia",
          event: "200m Butterfly",
          timeDrop: "-3.1s",
          quote: "I never thought I could break 2:10. Mohamed's programming changed everything about how I approach the water.",
          beforeTime: "2:12.8",
          afterTime: "2:09.7",
        },
        {
          name: "Milena",
          event: "50m Backstroke",
          timeDrop: "-1.8s",
          quote: "My start and underwater phase completely transformed. The dryland work translated directly to my race.",
          beforeTime: "33.2s",
          afterTime: "31.4s",
        },
        {
          name: "The Sibling Pair",
          event: "Multi-Event",
          timeDrop: "-4.5s combined",
          quote: "Both kids are faster, stronger, and actually enjoying training again. As parents, we couldn't ask for more.",
          beforeTime: "Various",
          afterTime: "PBs across all events",
        },
      ],
    },
    contentHub: {
      title: "Content Hub",
      subtitle: "Technique breakdowns, dryland concepts, and the science behind faster swimming",
    },
    leadMagnet: {
      headline: "Download the Swimmer's Core Protocol.",
      subtext: "Stop wasting time on crunches. Get the PDF guide to building core power that actually translates to the water.",
      cta: "Download PDF",
      placeholder: "Enter your email address",
      success: "Check your inbox! 🎉",
    },
    footer: {
      headline: "Ready to drop your times?",
      cta: "Book a Call",
      rights: "All rights reserved.",
    },
    cloud: {
      hero: "Welcome! I'm your guide. Let's explore how Mohamed can transform your performance.",
      about: "Discover the science behind the coaching.",
      services: "Tailored programs for every level.",
      results: "Real athletes. Real results.",
    },
  },
  ar: {
    nav: {
      about: "عن المدرب",
      services: "الخدمات",
      results: "النتائج",
      contact: "تواصل معنا",
      book: "احجز استشارة",
    },
    hero: {
      headline: "مدرب القوة والتكييف الجاف للسباحين",
      subheadline: "بدايات أسرع • قوة انفجارية • سباقات أسرع",
      cta: "احجز استشارة",
    },
    about: {
      title: "القصة",
      positioning: "تدريب مبني على أسس علمية في سوق يفتقر للكفاءة.",
      education: "الأسس الأكاديمية",
      educationDetail: "درجة من جامعة بنها — الجمع بين الدقة الأكاديمية والتطبيق العملي في التدريب.",
      credentials: "تدريب مكثف في المنهجيات المتقدمة لـ EXOS XPS، IASST S&C، NASM-PES، و CSCS. يطبق محمد مبادئ علمية على مستوى النخبة من هذه الأطر في برنامج كل رياضي، لضمان نتائج تعتمد على الميكانيكا الحيوية المثبتة بدلاً من التخمين.",
      methodologies: "المنهجيات التطبيقية",
    },
    services: {
      title: "الخدمات",
      subtitle: "برامج مصممة لأقصى أداء مائي",
      online: {
        title: "التدريب عن بعد",
        desc: "برامج مصممة خصيصاً للسباحين التنافسيين. تدرب بتوجيه على مستوى النخبة من أي مكان في العالم.",
        features: ["كتل تدريبية مخصصة", "تحليل فيديو", "متابعة أسبوعية", "إرشاد غذائي"],
      },
      inPerson: {
        title: "التدريب الشخصي",
        desc: "تدريب عملي على الحوض وتمارين جافة لتحقيق أقصى مكاسب في الأداء وتحسين التقنية.",
        features: ["جلسات فردية", "تدريب الفريق", "دوائر التمارين", "تحضير المنافسات"],
      },
      parents: {
        title: "لأولياء الأمور",
        desc: "حماية الرياضيين الصغار: الحد من مخاطر التخصص المبكر وتجنب الإرهاق والإصابات من خلال التدريب البدني السليم.",
        features: ["تقييم المخاطر", "برامج مناسبة للعمر", "الوقاية من الإصابات", "التطوير طويل المدى"],
      },
    },
    results: {
      title: "النتائج والأدلة",
      subtitle: "رياضيون حقيقيون. أرقام حقيقية. بلا تخمين.",
      athletes: [
        {
          name: "مازن",
          event: "100م حرة",
          timeDrop: "-2.3 ثانية",
          quote: "انخفض الوقت بمقدار 2.3 ثانية في سباق 100 متر حرة في دورة تدريبية واحدة. فرق لا يصدق في القوة الانفجارية.",
          beforeTime: "58.4 ثانية",
          afterTime: "56.1 ثانية",
        },
        {
          name: "يحيى",
          event: "200م فراشة",
          timeDrop: "-3.1 ثانية",
          quote: "لم أتخيل أنني سأكسر حاجز 2:10. برنامج محمد غيّر كل شيء.",
          beforeTime: "2:12.8",
          afterTime: "2:09.7",
        },
        {
          name: "ميلينا",
          event: "50م ظهر",
          timeDrop: "-1.8 ثانية",
          quote: "تحولت بدايتي وطوري تحت الماء بالكامل. التدريب الجاف ترجم مباشرة إلى السباق.",
          beforeTime: "33.2 ثانية",
          afterTime: "31.4 ثانية",
        },
        {
          name: "الأخوة",
          event: "سباقات متعددة",
          timeDrop: "-4.5 ثانية مجتمعة",
          quote: "كلا الطفلين أسرع وأقوى ويستمتعان بالتدريب مجدداً. كأولياء أمور، لا نستطيع أن نطلب أكثر.",
          beforeTime: "متنوع",
          afterTime: "أرقام شخصية جديدة",
        },
      ],
    },
    contentHub: {
      title: "مركز المحتوى",
      subtitle: "تحليل الأداء الفني ومفاهيم التدريب الجاف والعلم وراء السباحة الأسرع",
    },
    leadMagnet: {
      headline: "حمل دليل الجذع للسباحين.",
      subtext: "توقف عن إضاعة الوقت في تمارين البطن التقليدية. احصل على دليل PDF لبناء قوة الجذع التي تترجم فعلياً إلى أداء في الماء.",
      cta: "تنزيل الـ PDF",
      placeholder: "أدخل بريدك الإلكتروني",
      success: "تفقد صندوق بريدك! 🎉",
    },
    footer: {
      headline: "مستعد لتحطيم أرقامك؟",
      cta: "احجز مكالمة",
      rights: "جميع الحقوق محفوظة.",
    },
    cloud: {
      hero: "مرحباً! أنا دليلك. دعنا نستكشف كيف يمكن لمحمد أن يغير أداءك.",
      about: "اكتشف العلم وراء التدريب.",
      services: "برامج مصممة لكل المستويات.",
      results: "رياضيون حقيقيون. نتائج حقيقية.",
    },
  },
};
