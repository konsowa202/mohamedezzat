"use client";

import React, { useState } from "react";
import { Loader2, Save, Globe, ImageIcon, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { updateSiteSettings, addClientResult, deleteClientResult } from "@/app/actions/manageContent";
import { createClient } from "@/utils/supabase/client";

export function WebsiteCMS({ siteSettings, clientResults }: { siteSettings: any[], clientResults: any[] }) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingResult, setIsAddingResult] = useState(false);
  const supabase = createClient();

  // Helper to safely parse JSON content
  const getContent = (key: string) => {
    return siteSettings?.find(s => s.section_key === key)?.content || {};
  };

  // State for Hero
  const heroContent = getContent("hero");
  const [heroState, setHeroState] = useState({
    title_en: heroContent.title_en || "",
    title_ar: heroContent.title_ar || "",
    subtitle_en: heroContent.subtitle_en || "",
    subtitle_ar: heroContent.subtitle_ar || "",
    cta_en: heroContent.cta_en || "",
    cta_ar: heroContent.cta_ar || "",
  });

  // State for About
  const aboutContent = getContent("about");
  const [aboutState, setAboutState] = useState({
    title_en: aboutContent.title_en || "",
    title_ar: aboutContent.title_ar || "",
    description_en: aboutContent.description_en || "",
    description_ar: aboutContent.description_ar || "",
  });

  // State for Services
  const servicesContent = getContent("services");
  const [servicesState, setServicesState] = useState({
    title_en: servicesContent.title_en || "",
    title_ar: servicesContent.title_ar || "",
  });

  const handleSave = async (sectionKey: string, content: any) => {
    setIsSaving(true);
    try {
      const res = await updateSiteSettings(sectionKey, content);
      if (res.error) throw new Error(res.error);
      alert(`${sectionKey.toUpperCase()} section updated successfully!`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsSaving(false);
  };

  const AccordionHeader = ({ id, title, icon: Icon }: any) => (
    <button 
      type="button"
      onClick={() => setActiveAccordion(activeAccordion === id ? null : id)}
      className="w-full flex items-center justify-between p-6 bg-[#0a2d54]/30 hover:bg-[#0a2d54]/40 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-[#38BDF8]" />
        <span className="font-bold text-white text-lg">{title}</span>
      </div>
      {activeAccordion === id ? <ChevronUp className="text-[#5B7186]" /> : <ChevronDown className="text-[#5B7186]" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. HERO SECTION */}
      <div className="border border-[#38BDF8]/10 rounded-2xl overflow-hidden bg-[#06060A]">
        <AccordionHeader id="hero" title="Hero Section (Main Banner)" icon={Globe} />
        {activeAccordion === "hero" && (
          <div className="p-6 border-t border-[#38BDF8]/10 bg-[#0a2d54]/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[#38BDF8] font-bold border-b border-white/5 pb-2">English Content</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Headline</label>
                  <input value={heroState.title_en} onChange={e => setHeroState({...heroState, title_en: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Subtitle</label>
                  <textarea value={heroState.subtitle_en} onChange={e => setHeroState({...heroState, subtitle_en: e.target.value})} rows={3} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Button Text</label>
                  <input value={heroState.cta_en} onChange={e => setHeroState({...heroState, cta_en: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <h3 className="text-[#38BDF8] font-bold border-b border-white/5 pb-2">المحتوى العربي</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">العنوان الرئيسي</label>
                  <input value={heroState.title_ar} onChange={e => setHeroState({...heroState, title_ar: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">الوصف الفرعي</label>
                  <textarea value={heroState.subtitle_ar} onChange={e => setHeroState({...heroState, subtitle_ar: e.target.value})} rows={3} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">نص الزر</label>
                  <input value={heroState.cta_ar} onChange={e => setHeroState({...heroState, cta_ar: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => handleSave('hero', heroState)} disabled={isSaving} className="bg-[#38BDF8] text-[#06060A] hover:bg-[#38BDF8]/90 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Hero
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. ABOUT SECTION */}
      <div className="border border-[#38BDF8]/10 rounded-2xl overflow-hidden bg-[#06060A]">
        <AccordionHeader id="about" title="About Section" icon={Globe} />
        {activeAccordion === "about" && (
          <div className="p-6 border-t border-[#38BDF8]/10 bg-[#0a2d54]/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[#38BDF8] font-bold border-b border-white/5 pb-2">English Content</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Title</label>
                  <input value={aboutState.title_en} onChange={e => setAboutState({...aboutState, title_en: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Description</label>
                  <textarea value={aboutState.description_en} onChange={e => setAboutState({...aboutState, description_en: e.target.value})} rows={6} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <h3 className="text-[#38BDF8] font-bold border-b border-white/5 pb-2">المحتوى العربي</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">العنوان</label>
                  <input value={aboutState.title_ar} onChange={e => setAboutState({...aboutState, title_ar: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">الوصف</label>
                  <textarea value={aboutState.description_ar} onChange={e => setAboutState({...aboutState, description_ar: e.target.value})} rows={6} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => handleSave('about', aboutState)} disabled={isSaving} className="bg-[#38BDF8] text-[#06060A] hover:bg-[#38BDF8]/90 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save About
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. SERVICES SECTION */}
      <div className="border border-[#38BDF8]/10 rounded-2xl overflow-hidden bg-[#06060A]">
        <AccordionHeader id="services" title="Services Section" icon={Globe} />
        {activeAccordion === "services" && (
          <div className="p-6 border-t border-[#38BDF8]/10 bg-[#0a2d54]/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[#38BDF8] font-bold border-b border-white/5 pb-2">English Content</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Title</label>
                  <input value={servicesState.title_en} onChange={e => setServicesState({...servicesState, title_en: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <h3 className="text-[#38BDF8] font-bold border-b border-white/5 pb-2">المحتوى العربي</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">العنوان</label>
                  <input value={servicesState.title_ar} onChange={e => setServicesState({...servicesState, title_ar: e.target.value})} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => handleSave('services', servicesState)} disabled={isSaving} className="bg-[#38BDF8] text-[#06060A] hover:bg-[#38BDF8]/90 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Services
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS CMS (Existing functionality moved here) */}
      <div className="border border-[#38BDF8]/10 rounded-2xl overflow-hidden bg-[#06060A]">
        <AccordionHeader id="results" title="Client Results & Success Stories" icon={ImageIcon} />
        {activeAccordion === "results" && (
          <div className="p-6 border-t border-[#38BDF8]/10 bg-[#0a2d54]/10 space-y-6">
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                setIsAddingResult(true);
                const form = e.currentTarget;
                const formData = new FormData(form);
                const file = (form.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];
                
                try {
                  let image_url = formData.get("image_url") as string;
                  if (file) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `result-${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage.from('results').upload(fileName, file);
                    if (uploadError) throw new Error("Upload failed: " + uploadError.message);
                    const { data: { publicUrl } } = supabase.storage.from('results').getPublicUrl(fileName);
                    image_url = publicUrl;
                  }
                  formData.set("image_url", image_url);
                  formData.delete("file");
                  const res = await addClientResult(formData);
                  if (res.error) throw new Error(res.error);
                  form.reset();
                  alert("Result added successfully!");
                } catch (err: any) {
                  alert(err.message);
                }
                setIsAddingResult(false);
              }}
              className="bg-[#06060A] border border-white/10 p-6 rounded-xl space-y-4"
            >
              <h3 className="text-[#38BDF8] font-bold mb-4">Add New Result</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Client Name</label>
                  <input name="client_name" required className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Achievement</label>
                  <input name="achievement" required placeholder="e.g. Lost 10kg" className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="bg-[#0a2d54]/30 border border-dashed border-white/20 rounded-xl p-4 text-center">
                <label className="cursor-pointer block">
                  <span className="block text-xs font-bold uppercase text-[#38BDF8] mb-1">Upload Photo</span>
                  <input type="file" name="file" accept="image/*" className="w-full text-xs text-[#5B7186] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#38BDF8]/10 file:text-[#38BDF8]" />
                </label>
              </div>
              <div className="text-center text-xs text-[#5B7186]">— OR —</div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Image URL</label>
                <input name="image_url" placeholder="https://..." className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <button type="submit" disabled={isAddingResult} className="w-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] hover:bg-[#38BDF8]/20 px-4 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                {isAddingResult ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Result
              </button>
            </form>

            <div className="bg-[#06060A] border border-white/10 rounded-xl overflow-hidden mt-6">
              <table className="w-full text-left text-sm text-[#5B7186]">
                <thead className="bg-[#0a2d54]/30 text-xs uppercase font-bold tracking-wider text-white">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Achievement</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clientResults?.map((r) => (
                    <tr key={r.id}>
                      <td className="px-6 py-3">
                        <img src={r.image_url} alt={r.client_name} className="w-12 h-12 rounded-lg object-cover" />
                      </td>
                      <td className="px-6 py-4 font-bold text-white">{r.client_name}</td>
                      <td className="px-6 py-4 text-[#38BDF8] font-medium">{r.achievement}</td>
                      <td className="px-6 py-4 text-right">
                        <form action={async () => { await deleteClientResult(r.id); }}>
                          <button type="submit" className="p-2 rounded-lg text-red-400 hover:bg-red-500/10">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {(!clientResults || clientResults.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm">No results added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
