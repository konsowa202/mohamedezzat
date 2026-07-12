import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FileText, ShieldAlert } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user assets
  const { data: assets } = await supabase
    .from('user_assets')
    .select('*, resources(*)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const subscriptions = assets?.filter(a => a.asset_type === 'subscription') || [];
  const grantedResources = assets?.filter(a => a.asset_type === 'resource') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Athlete Dashboard</h1>
        <p className="text-[#5B7186]">View your active plans and download your premium resources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Subscriptions */}
        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl shadow-card-deep overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#06060A]/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#38BDF8]" />
              Active Plans
            </h2>
          </div>
          <div className="p-6">
            {subscriptions.length > 0 ? (
              <ul className="space-y-4">
                {subscriptions.map(sub => (
                  <li key={sub.id} className="p-4 rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold">{sub.asset_name}</h3>
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 rounded-full">
                        {sub.status}
                      </span>
                    </div>
                    {sub.expires_at && (
                      <p className="text-xs text-[#5B7186]">Valid until: {new Date(sub.expires_at).toLocaleDateString()}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#5B7186] text-sm">No active subscriptions found.</p>
                <p className="text-xs mt-2 text-[#38BDF8]">Contact the coach to activate your plan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Premium Resources */}
        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl shadow-card-deep overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#06060A]/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-amber-500" />
              Premium Resources
            </h2>
          </div>
          <div className="p-6">
            {grantedResources.length > 0 ? (
              <ul className="space-y-4">
                {grantedResources.map(res => (
                  <li key={res.id} className="p-4 rounded-2xl border border-white/5 bg-[#06060A] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group hover:border-amber-500/30 transition-colors">
                    <div>
                      <h3 className="text-white font-bold group-hover:text-amber-500 transition-colors">{res.asset_name}</h3>
                      <p className="text-xs text-[#5B7186] mt-1">{res.resources?.description || "Access granted by coach."}</p>
                    </div>
                    {res.resources?.file_url ? (
                      <a 
                        href={res.resources.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="shrink-0 bg-amber-500 hover:bg-amber-400 text-[#06060A] text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-[#5B7186] shrink-0">No File</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#5B7186] text-sm">You haven't unlocked any premium resources yet.</p>
                <a href="/resources" className="inline-block mt-4 text-xs font-bold text-amber-500 hover:text-amber-400">
                  Browse Library &rarr;
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
