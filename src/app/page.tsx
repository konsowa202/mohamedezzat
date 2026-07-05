"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Results } from "@/components/Results";
import { ContentHub } from "@/components/ContentHub";
import { LeadMagnet } from "@/components/LeadMagnet";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <About />
        <Services />
        <Results />
        <ContentHub />
        <LeadMagnet />
      </main>
      <Footer />
    </>
  );
}
