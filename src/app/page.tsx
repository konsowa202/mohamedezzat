import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Results } from "@/components/Results";
import { ContentHub } from "@/components/ContentHub";
import { LeadMagnet } from "@/components/LeadMagnet";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { data: siteSettings },
    { data: clientResults }
  ] = await Promise.all([
    supabase.from("site_settings").select("*"),
    supabase.from("client_results").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false })
  ]);

  const heroSettings = siteSettings?.find(s => s.section_key === 'hero')?.content;
  const aboutSettings = siteSettings?.find(s => s.section_key === 'about')?.content;
  const servicesSettings = siteSettings?.find(s => s.section_key === 'services')?.content;

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero heroData={heroSettings} />
        <About aboutData={aboutSettings} />
        <Services servicesData={servicesSettings} />
        <Results clientResults={clientResults || []} />
        <ContentHub />
        <LeadMagnet />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
