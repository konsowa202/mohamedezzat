"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function VisitTracker() {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from("visit_logs").insert({
          page_path: pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Failed to track visit", error);
      }
    };

    trackVisit();
  }, [pathname, supabase]);

  return null;
}
