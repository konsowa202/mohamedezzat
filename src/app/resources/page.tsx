import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight, FileText, Lock } from "lucide-react";

export const revalidate = 60; // Revalidate every 60s

export default async function ResourcesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#06060A] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Performance Resources
          </h1>
          <p className="text-lg text-[#5B7186] max-w-2xl mx-auto">
            Science-backed guides and checklists to optimize your training and drop your times.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources?.map((resource) => (
            <Link 
              key={resource.slug} 
              href={`/resources/${resource.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-8 shadow-card-deep hover:border-[#38BDF8]/30 transition-all duration-500 block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-full bg-[#06060A] border border-white/10 flex items-center justify-center text-[#38BDF8] mb-6 shadow-glow-blue-sm">
                  {resource.type === 'paid' ? <Lock size={20} /> : <FileText size={20} />}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${resource.type === 'paid' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'}`}>
                    {resource.type === 'paid' ? 'PAID' : 'FREE'}
                  </span>
                  {resource.price && (
                    <span className="text-[#e8ecf0] text-sm font-bold">${resource.price}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#38BDF8] transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-[#5B7186] text-sm leading-relaxed mb-8 flex-grow">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5B7186] group-hover:text-[#38BDF8] transition-colors mt-auto pt-6 border-t border-white/10">
                  <span>Get Access</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          {(!resources || resources.length === 0) && (
            <div className="col-span-full text-center py-20 text-[#5B7186]">
              No resources available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
