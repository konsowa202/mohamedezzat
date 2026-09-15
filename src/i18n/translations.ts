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
    pillars: {
      tag: string;
      title: string;
      desc: string;
    }[];
  };
  services: {
    title: string;
    subtitle: string;
    oneOnOne: { title: string; desc: string; features: string[] };
    online: { title: string; desc: string; features: string[] };
    youth: { title: string; desc: string; features: string[] };
    team: { title: string; desc: string; features: string[] };
  };
  results: {
    title: string;
    subtitle: string;
    areas: {
      title: string;
      desc: string;
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
      headline: "Strength & Conditioning for Faster Swimming",
      subheadline: "Build the strength, power and athletic qualities that help swimmers improve their starts, turns, underwaters and sprint performance.",
      cta: "Apply for Coaching",
    },
    about: {
      title: "The Difference",
      positioning: "The website focuses on swimming performance, not bodybuilding or aesthetics. Swimmers need structural strength and rate of force development (RFD) to excel in the water.",
      education: "Specialized Training",
      educationDetail: "Dedicated entirely to the science of swimming performance and athletic development.",
      credentials: "Evidence-based strength & conditioning methodologies tailored for aquatic athletes.",
      methodologies: "Applied Methodologies",
      pillars: [
        { title: "Science-backed programming", tag: "EVIDENCE-BASED", desc: "No random workouts. Everything is programmed with precise physiological adaptations in mind." },
        { title: "Strength & Conditioning education", tag: "METHODOLOGY", desc: "Teaching athletes not just how to move, but why they are moving that way." },
        { title: "Swimming-specific application", tag: "TRANSFER", desc: "Dryland must transfer to the water. We focus on power, starts, and underwater mechanics." },
        { title: "Youth development focus", tag: "LONG-TERM", desc: "Protecting young athletes from early specialization and preventing burnout and injury." }
      ],
    },
    services: {
      title: "Services",
      subtitle: "Swimming-specific dryland coaching and programming",
      oneOnOne: {
        title: "1:1 Dryland Coaching",
        desc: "For individual swimmers who need personalized programming and hands-on coaching.",
        features: ["Individual assessment", "Personalized plan", "Performance testing"],
      },
      online: {
        title: "Online Coaching",
        desc: "For swimmers who train at their own facility but need elite-level programming.",
        features: ["Individual program", "Exercise video library", "Progress tracking"],
      },
      youth: {
        title: "Youth Swimmer Development",
        desc: "Focused on younger athletes, prioritizing physical literacy and long-term athletic development.",
        features: ["Movement quality", "Coordination", "Injury-risk reduction"],
      },
      team: {
        title: "Team / Academy Dryland",
        desc: "For swimming clubs and academies looking to integrate structured S&C.",
        features: ["Group programming", "Testing batteries", "Team workload monitoring"],
      },
    },
    results: {
      title: "What We Work On",
      subtitle: "Science-based approaches to improve aquatic performance.",
      areas: [
        {
          title: "Starts & Turns",
          desc: "Improving rate of force development (RFD) and power output for explosive off-the-block speed and walls.",
        },
        {
          title: "Underwaters & Sprint",
          desc: "Building core strength and mobility to maintain efficient dolphin kicks and maximum sprint velocities.",
        },
        {
          title: "Injury Risk Reduction",
          desc: "Strengthening vulnerable joints and ensuring balanced muscular development to keep swimmers healthy.",
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
      headline: "التدريب البدني لسباحة أسرع",
      subheadline: "بناء القوة، الطاقة، والخصائص الرياضية التي تساعد السباحين على تحسين البدايات، الدورانات، تحت الماء، وسرعة السبرنت.",
      cta: "قدم طلب تدريب",
    },
    about: {
      title: "القصة",
      positioning: "الموقع يركز على أداء السباحة، وليس بناء الأجسام. يحتاج السباحون إلى قوة هيكلية ومعدل تطوير القوة للتفوق في الماء.",
      education: "التدريب المتخصص",
      educationDetail: "مكرس بالكامل لعلوم أداء السباحة والتطور الرياضي.",
      credentials: "منهجيات تدريب قوة وتكييف مبنية على الأدلة ومصممة للرياضيين المائيين.",
      methodologies: "المنهجيات التطبيقية",
      pillars: [
        { title: "برمجة مبنية على العلم", tag: "علمي", desc: "لا توجد تدريبات عشوائية. كل شيء مبرمج مع وضع التكيفات الفسيولوجية الدقيقة في الاعتبار." },
        { title: "التعليم والوعي الرياضي", tag: "المنهجية", desc: "تعليم الرياضيين ليس فقط كيفية الحركة، بل لماذا يتحركون بهذه الطريقة." },
        { title: "تطبيق مخصص للسباحة", tag: "نقل الأداء", desc: "يجب أن ينعكس التدريب الأرضي على الماء. نركز على القوة والبدايات وحركات تحت الماء." },
        { title: "التركيز على تطوير الناشئين", tag: "طويل الأمد", desc: "حماية الرياضيين الصغار من التخصص المبكر ومنع الإرهاق والإصابات." }
      ],
    },
    services: {
      title: "الخدمات",
      subtitle: "تدريب بدني مخصص للسباحين",
      oneOnOne: {
        title: "تدريب بدني 1:1",
        desc: "للسباحين الأفراد الذين يحتاجون إلى برنامج مخصص وتدريب عملي.",
        features: ["تقييم فردي", "خطة مخصصة", "اختبارات أداء"],
      },
      online: {
        title: "تدريب عن بعد",
        desc: "للسباحين الذين يتدربون في أنديتهم ولكنهم بحاجة إلى برمجة تدريبية احترافية.",
        features: ["برنامج فردي", "مكتبة فيديو للتمارين", "تتبع التقدم"],
      },
      youth: {
        title: "تطوير السباحين الناشئين",
        desc: "يركز على الرياضيين الصغار، مع إعطاء الأولوية لمحو الأمية البدنية والتطور الرياضي طويل المدى.",
        features: ["جودة الحركة", "التوافق العضلي العصبي", "الحد من مخاطر الإصابة"],
      },
      team: {
        title: "تدريب بدني للفرق والأكاديميات",
        desc: "لأندية السباحة والأكاديميات التي تتطلع إلى دمج تدريب قوة وتكييف منظم.",
        features: ["برمجة جماعية", "بطاريات اختبار", "مراقبة عبء التدريب للفريق"],
      },
    },
    results: {
      title: "مجالات العمل",
      subtitle: "نهج مبني على العلم لتحسين الأداء المائي.",
      areas: [
        {
          title: "البدايات والدورانات",
          desc: "تحسين معدل تطوير القوة (RFD) والطاقة الانفجارية لسرعة الانطلاق من المكعب والدفع من الحائط.",
        },
        {
          title: "تحت الماء والسرعة",
          desc: "بناء قوة الجذع والمرونة للحفاظ على ضربات الدولفين الفعالة وسرعات السبرنت القصوى.",
        },
        {
          title: "تقليل مخاطر الإصابة",
          desc: "تقوية المفاصل المعرضة للإصابة وضمان التطور العضلي المتوازن للحفاظ على صحة السباحين.",
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
