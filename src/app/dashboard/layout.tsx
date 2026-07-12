import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { User, LogOut, Home, Settings } from "lucide-react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="min-h-screen bg-[#06060A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl p-6 shadow-card-deep sticky top-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center font-bold text-xl border border-[#38BDF8]/20 shadow-glow-blue-sm">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-white font-bold truncate">{profile?.full_name || "Athlete"}</h2>
                <p className="text-xs text-[#5B7186] truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5">
                <Home size={18} className="text-[#38BDF8]" />
                <span className="text-sm font-semibold">Overview</span>
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5B7186] hover:bg-white/5 hover:text-white transition-colors">
                <Settings size={18} />
                <span className="text-sm font-semibold">Settings</span>
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t border-white/5">
              <form action={logout}>
                <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut size={18} />
                  <span className="text-sm font-semibold">Log Out</span>
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
