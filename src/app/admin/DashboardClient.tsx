"use client";

import React, { useState } from "react";
import { updateApplicationStatus } from "@/app/actions/updateApplicationStatus";
import { addResource, deleteResource } from "@/app/actions/manageResources";
import { grantUserAsset, revokeUserAsset } from "@/app/actions/manageClients";
import { Trash2, Users, FileText, ClipboardList, LayoutDashboard, DownloadCloud, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type DashboardClientProps = {
  stats: { visitsCount: number | null; leadsCount: number | null; applicationsCount: number };
  applications: any[];
  resources: any[];
  profiles: any[];
  userAssets: any[];
  emailsList: string;
};

export default function DashboardClient({
  stats,
  applications,
  resources,
  profiles,
  userAssets,
  emailsList
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceSlug, setNewResourceSlug] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const supabase = createClient();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewResourceTitle(val);
    // Auto-generate slug: lowercase, replace spaces and non-alphanumeric chars with hyphens
    setNewResourceSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "applications", label: "Applications", icon: ClipboardList },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
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
                      <div className="text-white bg-white/5 px-3 py-2 rounded-lg text-xs border border-white/5 inline-block">{app.primary_goal}</div>
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
                        {r.file_url ? (
                           <a href={r.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#38BDF8] hover:text-white transition-colors bg-[#38BDF8]/10 px-3 py-1.5 rounded-lg text-xs font-bold w-fit">
                             View <ChevronRight size={14} />
                           </a>
                        ) : (
                          <span className="text-xs bg-white/5 px-2 py-1 rounded">No File</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <form action={() => deleteResource(r.id)}>
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
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#06060A]/50">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="text-[#38BDF8]" size={20} /> Client Manager
              </h2>
              <p className="text-xs text-[#5B7186] mt-1">Manage user access and subscriptions.</p>
            </div>
          </div>
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
                                <form action={async () => {
                                  await revokeUserAsset(asset.id);
                                }}>
                                  <button type="submit" className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                </form>
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
                              <option value="">No PDF attached</option>
                              {resources?.map(r => <option key={r.id} value={r.id} className="truncate">{r.title}</option>)}
                            </select>
                            <input type="date" name="expires_at" className="w-1/2 bg-[#06060A] border border-white/10 rounded-lg px-3 py-2 text-[#5B7186] text-xs focus:border-[#38BDF8]" />
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
    </div>
  );
}
