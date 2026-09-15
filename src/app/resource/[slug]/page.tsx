import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // 1. Fetch resource metadata from DB
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!resource) {
    notFound();
  }

  // Check if it's a PDF by looking at the URL extension or guessing
  const isPdf = resource.file_url?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-32 pb-24 bg-[#06060A] relative isolate">
        {/* Background Effects */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-grid-masked" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col h-full">
          {/* Header */}
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1 rounded-full">
                {resource.type === "free" ? "Free Resource" : "Premium Material"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              {resource.title}
            </h1>
            <p className="text-[#5B7186] text-lg max-w-3xl">
              {resource.description}
            </p>
          </div>

          {/* Viewer Area */}
          <div className="flex-grow w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[70vh]">
            {resource.file_url ? (
              isPdf ? (
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.file_url)}&embedded=true`} 
                  className="w-full h-full min-h-[70vh] border-0"
                  title={resource.title}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[70vh] p-8 text-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Download</h3>
                  <p className="text-[#5B7186] mb-8 max-w-md">This file format cannot be previewed directly in the browser. Click below to download the file to your device.</p>
                  <a 
                    href={resource.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#38BDF8] px-8 py-4 font-bold text-[#06060A] hover:bg-[#38BDF8]/90 transition-all shadow-glow-blue"
                  >
                    Download File
                  </a>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full min-h-[70vh] text-[#5B7186]">
                No file attached to this resource.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
