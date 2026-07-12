import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ResourceForm } from "@/components/ResourceForm";

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

        <ResourceForm resource={resource} />
      </div>
      {/* Cloudflare Turnstile Script */}
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    </div>
  );
}
