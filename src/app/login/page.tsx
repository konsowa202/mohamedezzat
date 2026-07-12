import { login } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#06060A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-8 rounded-3xl shadow-card-deep">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] mb-2 block">
            SECURE ACCESS
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
        </div>

        <form action={login} className="space-y-6">
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
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#38BDF8] px-8 py-3.5 text-sm font-black text-[#06060A] hover:bg-[#38BDF8]/90 transition-all shadow-glow-blue"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#5B7186] text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#38BDF8] hover:underline font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
