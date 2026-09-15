import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FileText, ShieldAlert } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user assets, workouts, videos, and pbs
  const [
    { data: assets },
    { data: sessions },
    { data: videos },
    { data: pbs }
  ] = await Promise.all([
    supabase.from('user_assets').select('*, resources(*)').eq('user_id', user?.id).order('created_at', { ascending: false }),
    supabase.from('workout_sessions').select('*, workouts(*)').eq('client_id', user?.id).order('scheduled_date', { ascending: true }),
    supabase.from('technique_videos').select('*').eq('client_id', user?.id).order('created_at', { ascending: false }),
    supabase.from('personal_bests').select('*').eq('client_id', user?.id).order('achieved_date', { ascending: false })
  ]);

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
                    {res.status === 'pending_payment' ? (
                      <span className="shrink-0 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold px-4 py-2 rounded-lg">
                        Payment Pending
                      </span>
                    ) : res.custom_file_url || res.resources?.file_url ? (
                      <a 
                        href={res.custom_file_url || res.resources?.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="shrink-0 bg-[#38BDF8] hover:bg-[#38BDF8]/80 text-[#06060A] text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-glow-blue-sm"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-[#5B7186] shrink-0">No File Attached</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Workouts */}
        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl shadow-card-deep overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#06060A]/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#38BDF8]" />
              Training Log
            </h2>
          </div>
          <div className="p-6">
            {sessions && sessions.length > 0 ? (
              <ul className="space-y-4">
                {sessions.map((session: any) => (
                  <li key={session.id} className="p-4 rounded-2xl border border-white/5 bg-[#06060A]">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold">{session.workouts?.title || "Workout"}</h3>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${session.completed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-500'}`}>
                        {session.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B7186]">Scheduled: {new Date(session.scheduled_date).toLocaleDateString()}</p>
                    {session.workouts?.description && <p className="text-sm mt-2 text-white/80">{session.workouts.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#5B7186] text-sm">No upcoming workouts.</p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Bests */}
        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl shadow-card-deep overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#06060A]/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-green-400" />
              Personal Bests
            </h2>
          </div>
          <div className="p-6">
            {pbs && pbs.length > 0 ? (
              <ul className="space-y-4">
                {pbs.map((pb: any) => (
                  <li key={pb.id} className="flex justify-between items-center p-4 rounded-2xl border border-white/5 bg-[#06060A]">
                    <div>
                      <h3 className="text-white font-bold">{pb.event}</h3>
                      <p className="text-xs text-[#5B7186]">{new Date(pb.achieved_date).toLocaleDateString()} {pb.pool_type ? `(${pb.pool_type})` : ''}</p>
                    </div>
                    <div className="text-[#38BDF8] font-mono font-bold text-lg">
                      {pb.time_seconds}s
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#5B7186] text-sm">No personal bests logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technique Videos */}
      <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl shadow-card-deep overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#06060A]/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-pink-400" />
            Technique Analysis
          </h2>
          <button className="bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-pink-500/30">
            + Upload Video
          </button>
        </div>
        <div className="p-6">
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video: any) => (
                <div key={video.id} className="border border-white/5 bg-[#06060A] rounded-xl overflow-hidden group">
                  <div className="aspect-video bg-[#0a2d54]/30 relative flex items-center justify-center">
                    <a href={video.video_url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10"></a>
                    <span className="text-[#5B7186] text-xs font-mono uppercase">Video Link</span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">{video.stroke_type}</span>
                      <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full ${video.status === 'reviewed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-500'}`}>
                        {video.status.replace('_', ' ')}
                      </span>
                    </div>
                    {video.coach_feedback && (
                      <p className="text-xs text-white/80 mt-2 p-2 bg-[#0a2d54]/30 rounded border border-white/5">
                        <span className="text-[#38BDF8] font-bold">Coach:</span> {video.coach_feedback}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#5B7186] text-sm">Upload a video of your swimming for coach feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
