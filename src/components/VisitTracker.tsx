"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function VisitTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from("visit_logs").insert({
          page_path: pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          // ip_hashed: Hash logic can be done via an edge function or server action if strict privacy is needed, 
          // or omitted since standard client insert doesn't expose IP natively.
        });
      } catch (error) {
        console.error("Failed to track visit", error);
      }
    };

    trackVisit();
  }, [pathname, supabase]);

  return null;
}
