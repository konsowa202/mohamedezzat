import { notFound } from "next/navigation";
import { submitLead } from "@/app/actions/submitLead";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResourcePage({ params }: PageProps) {
  const resolvedParams = await params;
  
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#06060A] pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-10 rounded-3xl shadow-card-deep">
        <div className="text-center mb-8">
          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-4 block ${resource.type === 'paid' ? 'text-amber-500' : 'text-[#38BDF8]'}`}>
            {resource.type === 'paid' ? `PREMIUM RESOURCE ($${resource.price})` : 'FREE RESOURCE'}
          </span>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
            {resource.title}
          </h1>
          <p className="text-[#5B7186] text-sm leading-relaxed">
            {resource.description}
          </p>
        </div>

        <form action={submitLead} className="space-y-6">
          <input type="hidden" name="slug" value={resource.slug} />
          
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
              placeholder="coach@example.com"
            />
          </div>

          {/* Turnstile Container */}
          <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>

          <button
            type="submit"
            className={`w-full rounded-xl px-8 py-4 text-sm font-black text-[#06060A] transition-all ${resource.type === 'paid' ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-[#38BDF8] hover:bg-[#38BDF8]/90 shadow-glow-blue'}`}
          >
            {resource.type === 'paid' ? 'Apply to Purchase' : 'Download Now'}
          </button>
          
          {resource.type === 'paid' && (
             <p className="text-center text-xs text-[#5B7186] mt-4">We will contact you via email with payment instructions.</p>
          )}
        </form>
      </div>
      {/* Cloudflare Turnstile Script */}
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    </div>
  );
}
