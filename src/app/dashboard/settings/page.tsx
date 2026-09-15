"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/updateProfile";
import { Loader2, Save, User } from "lucide-react";

export default function SettingsPage() {
  const [state, formAction, isPending] = useActionState(updateProfile, { success: false });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Profile Settings</h1>
        <p className="text-[#5B7186]">Update your account details and password.</p>
      </div>

      <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 rounded-3xl shadow-card-deep overflow-hidden p-8">
        <form action={formAction} className="space-y-6">
          
          {state?.message && (
            <div className={`p-4 rounded-xl text-sm font-bold border ${state.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {state.message || state.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-[#38BDF8]" />
              </div>
              <input
                name="fullName"
                type="text"
                className="w-full bg-[#06060A] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                placeholder="Enter new full name"
              />
            </div>
            <p className="text-[10px] text-[#5B7186] mt-2">Leave blank to keep current name.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                name="password"
                type="password"
                minLength={6}
                className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                placeholder="Enter new password (optional)"
              />
            </div>
            <p className="text-[10px] text-[#5B7186] mt-2">Must be at least 6 characters. Leave blank to keep current password.</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#38BDF8] text-[#06060A] font-black uppercase tracking-wider py-4 rounded-xl hover:bg-[#38BDF8]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-glow-blue"
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
