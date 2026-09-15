"use client";

import React, { useState } from "react";
import { updateApplicationStatus } from "@/app/actions/updateApplicationStatus";
import { addResource, deleteResource } from "@/app/actions/manageResources";
import { grantUserAsset, revokeUserAsset } from "@/app/actions/manageClients";
import { updateAssetStatus } from "@/app/actions/updateAssetStatus";
import { inviteClient } from "@/app/actions/inviteClient";
import { createWorkout, deleteWorkout } from "@/app/actions/manageWorkouts";
import { useActionState } from "react";
import { Trash2, Users, FileText, ClipboardList, LayoutDashboard, DownloadCloud, ChevronRight, Loader2, Send, Plus, X, Globe, Image as ImageIcon, Save, Check, Copy } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateSiteSettings, addClientResult, deleteClientResult } from "@/app/actions/manageContent";
import { WebsiteCMS } from "./WebsiteCMS";

type DashboardClientProps = {
  stats: { visitsCount: number | null; leadsCount: number | null; applicationsCount: number };
  applications: any[];
  resources: any[];
  profiles: any[];
  userAssets: any[];
  emailsList: string;
  workouts: any[];
  techniqueVideos: any[];
  siteSettings?: any[];
  clientResults?: any[];
};

export default function DashboardClient({
  stats,
  applications,
  resources,
  profiles,
  userAssets,
  emailsList,
  workouts,
  techniqueVideos,
  siteSettings,
  clientResults
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceSlug, setNewResourceSlug] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Coaching Tab State
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [exercises, setExercises] = useState([{ name: "", sets: "", reps: "", distance: "", rest: "", notes: "" }]);

  // Website Content Tab State
  const heroSettings = siteSettings?.find(s => s.section_key === 'hero')?.content || { title: "", subtitle: "", cta_text: "" };
  const [heroTitle, setHeroTitle] = useState(heroSettings.title);
  const [heroSubtitle, setHeroSubtitle] = useState(heroSettings.subtitle);
  const [heroCta, setHeroCta] = useState(heroSettings.cta_text);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isAddingResult, setIsAddingResult] = useState(false);

  const [inviteState, inviteAction, isInviting] = useActionState(inviteClient, { success: false });

  const supabase = createClient();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewResourceTitle(val);
    // Auto-generate slug: lowercase, replace spaces and non-alphanumeric chars with hyphens
    setNewResourceSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/resource/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleAddExercise = () => setExercises([...exercises, { name: "", sets: "", reps: "", distance: "", rest: "", notes: "" }]);
  const handleRemoveExercise = (index: number) => setExercises(exercises.filter((_, i) => i !== index));
  const handleExerciseChange = (index: number, field: string, value: string) => {
    const newEx = [...exercises];
    newEx[index] = { ...newEx[index], [field]: value };
    setExercises(newEx);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "applications", label: "Applications", icon: ClipboardList },
    { id: "website", label: "Website", icon: Globe },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "coaching", label: "Coaching", icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-[#0a2d54]/20 p-1 rounded-xl border border-[#38BDF8]/10 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-[#38BDF8] text-[#06060A] shadow-glow-blue-sm" 
                  : "text-[#5B7186] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-6 rounded-2xl shadow-card-deep relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={64} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5B7186] mb-2">Total Visits</div>
              <div className="text-4xl font-black text-white">{stats.visitsCount || 0}</div>
            </div>
            <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-6 rounded-2xl shadow-card-deep relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={64} className="text-[#38BDF8]" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5B7186] mb-2">Leads Generated</div>
              <div className="text-4xl font-black text-[#38BDF8]">{stats.leadsCount || 0}</div>
            </div>
            <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-6 rounded-2xl shadow-card-deep relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ClipboardList size={64} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5B7186] mb-2">Applications Filed</div>
              <div className="text-4xl font-black text-white">{stats.applicationsCount}</div>
            </div>
          </div>

          <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-6 rounded-2xl shadow-card-deep">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#38BDF8]/10 flex items-center justify-center">
                <DownloadCloud size={20} className="text-[#38BDF8]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Export Leads</h2>
                <p className="text-sm text-[#5B7186]">Copy the comma-separated emails below to paste into your campaign execution lists.</p>
              </div>
            </div>
            <textarea
              readOnly
              value={emailsList}
              rows={3}
              className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-[#38BDF8] focus:outline-none focus:border-[#38BDF8] transition-colors resize-none font-mono text-sm"
            />
          </div>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === "applications" && (
        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-2xl shadow-card-deep overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Live Applications</h2>
              <p className="text-xs text-[#5B7186] mt-1">Manage new coaching requests.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#5B7186]">
              <thead className="bg-[#06060A] text-xs uppercase font-bold tracking-wider text-[#5B7186]">
                <tr>
                  <th className="px-6 py-4">Athlete</th>
                  <th className="px-6 py-4">Goal</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications?.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white border border-white/10">
                          {app.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#38BDF8] transition-colors">{app.full_name}</div>
                          <div className="text-xs">Age: {app.athlete_age} • {new Date(app.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white bg-white/5 px-3 py-2 rounded-lg text-xs border border-white/5 inline-block mb-1">{app.primary_goals || "N/A"}</div>
                      <div className="text-[10px] text-[#5B7186]">{app.swimming_discipline} • {app.swimming_level}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{app.email}</div>
                      <div className="text-xs">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <form>
                        <input type="hidden" name="id" value={app.id} />
                        <select
                          name="status"
                          defaultValue={app.status}
                          className={`border rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors appearance-none ${
                            app.status === 'new' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                            app.status === 'contacted' ? 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]' :
                            app.status === 'accepted' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                            'bg-white/5 border-white/10 text-white'
                          }`}
                          onChange={(e) => {
                            const form = e.target.form;
                            if (form) {
                              const formData = new FormData(form);
                              updateApplicationStatus(formData.get("id") as string, formData.get("status") as string);
                            }
                          }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="accepted">Accepted</option>
                          <option value="archived">Archived</option>
                        </select>
                      </form>
                    </td>
                  </tr>
                ))}
                {(!applications || applications.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="text-[#5B7186]" size={32} />
                      </div>
                      <p className="text-white font-bold">No applications yet.</p>
                      <p className="text-sm mt-1">Wait for athletes to submit the form.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WEBSITE CONTENT TAB */}
      {activeTab === "website" && (
        <WebsiteCMS siteSettings={siteSettings || []} clientResults={clientResults || []} />
      )}

      {/* RESOURCES TAB */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1 bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-6 rounded-2xl shadow-card-deep h-fit sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="text-[#38BDF8]" size={20} />
              Add New Resource
            </h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (isUploading) return;
              
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
              const file = fileInput?.files?.[0];

              setIsUploading(true);
              setUploadProgress(0);

              // Fake progress bar animation DURING the upload process
              const interval = setInterval(() => {
                setUploadProgress(p => p >= 90 ? 90 : p + 5);
              }, 300);

              try {
                let file_url = formData.get("file_url") as string;

                // Upload file client-side if a file is selected
                if (file) {
                  const fileExt = file.name.split('.').pop();
                  const fileName = `${newResourceSlug}-${Date.now()}.${fileExt}`;
                  
                  const { error: uploadError } = await supabase.storage
                    .from('resources')
                    .upload(fileName, file);

                  if (uploadError) {
                    throw new Error("Failed to upload file: " + uploadError.message);
                  }

                  const { data: { publicUrl } } = supabase.storage
                    .from('resources')
                    .getPublicUrl(fileName);
                    
                  formData.set("file_url", publicUrl);
                  formData.delete("file"); // Remove the file from formData so server action doesn't re-upload
                }

                const result = await addResource(formData);
                if (result?.error) {
                  throw new Error(result.error);
                }

                clearInterval(interval);
                setUploadProgress(100);
                
                setTimeout(() => {
                  form.reset();
                  setNewResourceTitle("");
                  setNewResourceSlug("");
                  setIsUploading(false);
                  setUploadProgress(0);
                  alert("Resource added successfully!");
                }, 500);

              } catch (error: any) {
                console.error("Error saving resource:", error);
                alert("Error: " + error.message);
                clearInterval(interval);
                setIsUploading(false);
                setUploadProgress(0);
              }

            }} id="add-resource-form" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Title</label>
                <input 
                  name="title" 
                  value={newResourceTitle}
                  onChange={handleTitleChange}
                  required 
                  className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Slug (URL)</label>
                <input 
                  name="slug" 
                  value={newResourceSlug}
                  onChange={(e) => setNewResourceSlug(e.target.value)}
                  required 
                  className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8]" 
                  placeholder="e.g. core-protocol" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Description</label>
                <textarea name="description" required rows={3} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-[#38BDF8]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Type</label>
                  <select name="type" className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8]">
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Price ($)</label>
                  <input name="price" type="number" step="0.01" className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8]" placeholder="Optional" />
                </div>
              </div>
              
              <div className="bg-[#06060A] border border-dashed border-white/20 rounded-xl p-4 text-center hover:border-[#38BDF8]/50 transition-colors">
                <label className="cursor-pointer block">
                  <span className="block text-xs font-bold uppercase text-[#38BDF8] mb-1">Upload File (PDF/Doc)</span>
                  <input type="file" name="file" accept=".pdf,.doc,.docx" className="w-full text-xs text-[#5B7186] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#38BDF8]/10 file:text-[#38BDF8] hover:file:bg-[#38BDF8]/20" />
                </label>
              </div>

              <div className="text-center">
                <span className="text-xs text-[#5B7186]">— OR —</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">External File URL</label>
                <input name="file_url" className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8]" placeholder="https://drive.google.com/..." />
              </div>
              <button 
                type="submit" 
                disabled={isUploading}
                className={`w-full shadow-glow-blue bg-[#38BDF8] text-[#06060A] font-black uppercase tracking-wider rounded-lg py-3 mt-6 transition-all relative overflow-hidden ${isUploading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-[#38BDF8]/90'}`}
              >
                {/* Progress Bar Background */}
                {isUploading && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-white/30 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                )}
                
                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                    </>
                  ) : (
                    'Add Resource'
                  )}
                </div>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-2xl shadow-card-deep overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Manage Resources</h2>
                <p className="text-xs text-[#5B7186] mt-1">Your library of PDFs and plans.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#5B7186]">
                <thead className="bg-[#06060A] text-xs uppercase font-bold tracking-wider text-[#5B7186]">
                  <tr>
                    <th className="px-6 py-4">Resource</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">File Link</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {resources?.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${r.type === 'paid' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-[#38BDF8]/10 border-[#38BDF8]/20 text-[#38BDF8]'}`}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#38BDF8] transition-colors">{r.title}</div>
                            <div className="text-xs">/{r.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full border ${r.type === 'paid' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]'}`}>
                          {r.type} {r.price ? `($${r.price})` : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a 
                            href={`/resource/${r.slug}`}
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-1 text-[#38BDF8] hover:text-white transition-colors bg-[#38BDF8]/10 px-3 py-1.5 rounded-lg text-xs font-bold w-fit"
                            title="View Page"
                          >
                            <FileText size={14} /> View
                          </a>
                          <button
                            onClick={() => handleCopyLink(r.slug)}
                            className="text-[#5B7186] hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-lg text-xs"
                            title="Copy Link"
                          >
                            {copiedLink === r.slug ? (
                              <><Check size={14} className="text-green-400" /> Copied</>
                            ) : (
                              <><Copy size={14} /> Copy Link</>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <form action={async () => { await deleteResource(r.id); }}>
                          <button type="submit" className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {(!resources || resources.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="text-[#5B7186]" size={32} />
                        </div>
                        <p className="text-white font-bold">No resources found.</p>
                        <p className="text-sm mt-1">Upload your first PDF to start building your library.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CLIENTS TAB */}
      {activeTab === "clients" && (
        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-2xl shadow-card-deep overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#06060A]/50">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="text-[#38BDF8]" size={20} /> Client Manager
              </h2>
              <p className="text-xs text-[#5B7186] mt-1">Manage user access and subscriptions.</p>
            </div>
            
            {/* Invite Client Form */}
            <form action={inviteAction} className="bg-[#0a2d54]/30 border border-[#38BDF8]/20 p-3 rounded-xl flex flex-col sm:flex-row gap-2 items-center">
              <input type="text" name="fullName" placeholder="Full Name" required className="bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs w-full sm:w-32 focus:border-[#38BDF8]" />
              <input type="email" name="email" placeholder="Email Address" required className="bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs w-full sm:w-48 focus:border-[#38BDF8]" />
              <button type="submit" disabled={isInviting} className="w-full sm:w-auto bg-[#38BDF8] text-[#06060A] hover:bg-[#38BDF8]/90 font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {isInviting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Invite
              </button>
            </form>
          </div>
          
          {inviteState?.message && (
            <div className={`p-3 text-xs font-bold text-center border-b border-white/5 ${inviteState.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {inviteState.message || inviteState.error}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#5B7186]">
              <thead className="bg-[#06060A] text-xs uppercase font-bold tracking-wider text-[#5B7186]">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Granted Assets</th>
                  <th className="px-6 py-4 bg-[#0a2d54]/30 rounded-t-xl border-l border-r border-[#38BDF8]/10">Grant New Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {profiles?.filter(p => p.role !== 'admin').map((profile) => {
                  const clientAssets = userAssets?.filter(a => a.user_id === profile.id) || [];
                  return (
                    <tr key={profile.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-6 align-top">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#38BDF8]/10 flex items-center justify-center font-bold text-[#38BDF8] border border-[#38BDF8]/20">
                            {profile.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white">{profile.full_name || 'Unknown'}</div>
                            <div className="text-xs font-mono opacity-50">{profile.id.split('-')[0]}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 align-top">
                        {clientAssets.length > 0 ? (
                          <ul className="space-y-3">
                            {clientAssets.map(asset => (
                              <li key={asset.id} className="flex items-center justify-between bg-[#06060A] border border-white/5 rounded-xl px-4 py-3 shadow-sm group">
                                <div>
                                  <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full mr-3 border ${asset.asset_type === 'subscription' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                                    {asset.asset_type}
                                  </span>
                                  <span className="text-white font-medium text-sm">{asset.asset_name}</span>
                                  {asset.expires_at && <div className="text-[10px] text-[#5B7186] mt-1 ml-16">Expires: {new Date(asset.expires_at).toLocaleDateString()}</div>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <select 
                                    className={`text-[9px] uppercase font-bold px-2 py-1 rounded-lg outline-none appearance-none cursor-pointer ${
                                      asset.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                      asset.status === 'pending_payment' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                      'bg-white/5 text-[#5B7186] border border-white/10'
                                    }`}
                                    defaultValue={asset.status}
                                    onChange={(e) => updateAssetStatus(asset.id, e.target.value)}
                                  >
                                    <option value="active">Active</option>
                                    <option value="pending_payment">Pending Payment</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <form action={async () => {
                                    await revokeUserAsset(asset.id);
                                  }}>
                                    <button type="submit" className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                  </form>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-4 text-center">
                            <span className="text-xs">No assets granted yet.</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 align-top bg-[#0a2d54]/10 border-l border-r border-[#38BDF8]/10">
                        <form action={async (formData) => {
                          await grantUserAsset(formData);
                          // Reset form
                          const form = document.getElementById(`grant-form-${profile.id}`) as HTMLFormElement;
                          if (form) form.reset();
                        }} id={`grant-form-${profile.id}`} className="space-y-3">
                          <input type="hidden" name="user_id" value={profile.id} />
                          <div className="flex gap-2">
                            <select name="asset_type" className="w-1/3 bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-[#38BDF8]">
                              <option value="subscription">Sub</option>
                              <option value="resource">PDF</option>
                            </select>
                            <input name="asset_name" required placeholder="Name (e.g. 1 Month Plan)" className="w-2/3 bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-[#38BDF8]" />
                          </div>
                          <div className="flex gap-2">
                            <select name="resource_id" className="w-1/2 bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-[#38BDF8]">
                              <option value="">No Library PDF</option>
                              {resources?.map(r => <option key={r.id} value={r.id} className="truncate">{r.title}</option>)}
                            </select>
                            <input type="date" name="expires_at" className="w-1/2 bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-[#5B7186] text-xs focus:border-[#38BDF8]" />
                          </div>
                          <div>
                             <input type="url" name="custom_file_url" placeholder="Or Custom File URL (e.g. Google Drive link)" className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-[#5B7186] text-xs focus:border-[#38BDF8]" />
                          </div>
                          <button type="submit" className="w-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 hover:border-[#38BDF8]/50 text-xs font-bold py-2 rounded-lg transition-all">
                            + Grant Access
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
                {(!profiles || profiles.length <= 1) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-[#5B7186]" size={32} />
                      </div>
                      <p className="text-white font-bold">No registered clients yet.</p>
                      <p className="text-sm mt-1">Users will appear here when they create an account.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COACHING TAB */}
      {activeTab === "coaching" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Workouts Panel */}
            <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-2xl shadow-card-deep overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Workouts</h2>
                  <p className="text-xs text-[#5B7186] mt-1">Manage training programs.</p>
                </div>
                <button 
                  onClick={() => setShowWorkoutModal(true)}
                  className="bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus size={14} /> Create Workout
                </button>
              </div>
              <div className="p-6">
                {workouts?.length > 0 ? (
                  <ul className="space-y-3">
                    {workouts.map((workout: any) => (
                      <li key={workout.id} className="bg-[#06060A] border border-white/10 rounded-xl p-4 group">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-white">{workout.title}</div>
                            <div className="text-xs text-[#5B7186] mt-1 line-clamp-2">{workout.description}</div>
                          </div>
                          <form action={async () => { await deleteWorkout(workout.id); }}>
                            <button type="submit" className="text-[#5B7186] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                        <div className="text-[10px] text-white/50 mt-2 font-mono uppercase tracking-wider">{workout.exercises?.length || 0} EXERCISES</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white font-bold">No workouts yet.</p>
                    <p className="text-sm text-[#5B7186] mt-1">Create your first training plan.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Technique Videos Panel */}
            <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-2xl shadow-card-deep overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Technique Review</h2>
                <p className="text-xs text-[#5B7186] mt-1">Client video submissions for stroke analysis.</p>
              </div>
              <div className="p-6">
                {techniqueVideos?.length > 0 ? (
                  <ul className="space-y-3">
                    {techniqueVideos.map((video: any) => (
                      <li key={video.id} className="bg-[#06060A] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white text-sm">{video.profiles?.full_name || 'Client'}</div>
                          <div className="text-xs text-[#38BDF8] uppercase tracking-wider font-bold mt-1">{video.stroke_type}</div>
                          <div className="text-[10px] text-[#5B7186] mt-1">{new Date(video.created_at).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <a href={video.video_url} target="_blank" rel="noreferrer" className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
                            Review
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white font-bold">No video submissions.</p>
                    <p className="text-sm text-[#5B7186] mt-1">Clients will upload their swimming videos here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE WORKOUT MODAL */}
      {showWorkoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#06060A]/80 backdrop-blur-sm" onClick={() => !isCreatingWorkout && setShowWorkoutModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#06060A] border border-white/10 rounded-2xl shadow-card-deep overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0a2d54]/20">
              <h3 className="text-lg font-bold text-white">Create New Workout</h3>
              <button 
                onClick={() => setShowWorkoutModal(false)}
                disabled={isCreatingWorkout}
                className="text-[#5B7186] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form 
              className="flex flex-col overflow-hidden"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsCreatingWorkout(true);
                const formData = new FormData(e.currentTarget);
                formData.set("exercises", JSON.stringify(exercises));
                await createWorkout(formData);
                setIsCreatingWorkout(false);
                setShowWorkoutModal(false);
                setExercises([{ name: "", sets: "", reps: "", distance: "", rest: "", notes: "" }]);
              }}
            >
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Workout Title</label>
                    <input name="title" required className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8]" placeholder="e.g. Sprint Power Day 1" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#5B7186] mb-1">Description (Optional)</label>
                    <textarea name="description" rows={2} className="w-full bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#38BDF8] resize-none" placeholder="Goals for this session..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Exercises</h4>
                    <button type="button" onClick={handleAddExercise} className="text-xs font-bold text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1">
                      <Plus size={12} /> Add Exercise
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {exercises.map((ex, idx) => (
                      <div key={idx} className="bg-[#0a2d54]/10 border border-[#38BDF8]/10 rounded-xl p-4 relative group">
                        {exercises.length > 1 && (
                          <button type="button" onClick={() => handleRemoveExercise(idx)} className="absolute -top-2 -right-2 bg-[#06060A] border border-red-500/20 text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={12} />
                          </button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <input value={ex.name} onChange={(e) => handleExerciseChange(idx, "name", e.target.value)} required placeholder="Exercise Name (e.g. Back Squat)" className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-white text-sm focus:outline-none focus:border-[#38BDF8]" />
                          </div>
                          <div className="flex gap-2">
                            <input value={ex.sets} onChange={(e) => handleExerciseChange(idx, "sets", e.target.value)} placeholder="Sets (e.g. 4)" className="w-1/2 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs" />
                            <input value={ex.reps} onChange={(e) => handleExerciseChange(idx, "reps", e.target.value)} placeholder="Reps (e.g. 5)" className="w-1/2 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs" />
                          </div>
                          <div className="flex gap-2">
                            <input value={ex.distance} onChange={(e) => handleExerciseChange(idx, "distance", e.target.value)} placeholder="Distance" className="w-1/2 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs" />
                            <input value={ex.rest} onChange={(e) => handleExerciseChange(idx, "rest", e.target.value)} placeholder="Rest (e.g. 2m)" className="w-1/2 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs" />
                          </div>
                          <div className="sm:col-span-2">
                            <input value={ex.notes} onChange={(e) => handleExerciseChange(idx, "notes", e.target.value)} placeholder="Coach Notes..." className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs italic" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 border-t border-white/5 shrink-0 flex justify-end gap-3 bg-[#0a2d54]/20">
                <button type="button" onClick={() => setShowWorkoutModal(false)} disabled={isCreatingWorkout} className="px-4 py-2 text-xs font-bold text-[#5B7186] hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isCreatingWorkout} className="bg-[#38BDF8] text-[#06060A] hover:bg-[#38BDF8]/90 px-6 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                  {isCreatingWorkout ? <Loader2 size={14} className="animate-spin" /> : "Save Workout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
