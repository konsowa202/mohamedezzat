import { submitApplication } from "@/app/actions/submitApplication";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#06060A] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#38BDF8] mb-4 block">
            PERFORMANCE COACHING
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Apply for Coaching
          </h1>
          <p className="text-lg text-[#5B7186] max-w-xl mx-auto">
            Fill out the form below to apply for our specialized swimming strength & conditioning program.
          </p>
        </div>

        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-8 sm:p-10 rounded-3xl shadow-card-deep">
          <form action={submitApplication} className="space-y-6">
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="athleteAge" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                  Athlete Age
                </label>
                <input
                  type="number"
                  id="athleteAge"
                  name="athleteAge"
                  required
                  min="5"
                  max="99"
                  className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
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
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="primaryGoal" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                Primary Goal
              </label>
              <select
                id="primaryGoal"
                name="primaryGoal"
                required
                className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors appearance-none"
              >
                <option value="">Select a goal...</option>
                <option value="Starts & Turns">Improve Starts & Turns</option>
                <option value="Speed & Power">Increase Sprint Speed & Power</option>
                <option value="Injury Prevention">Injury Resilience & Prevention</option>
                <option value="General Strength">General Strength & Conditioning</option>
              </select>
            </div>

            <div>
              <label htmlFor="currentTimes" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                Current Times (Optional)
              </label>
              <input
                type="text"
                id="currentTimes"
                name="currentTimes"
                placeholder="e.g. 50m Free: 25.4s"
                className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Turnstile Container */}
            <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#38BDF8] px-8 py-4 text-sm font-black text-[#06060A] hover:bg-[#38BDF8]/90 transition-all shadow-glow-blue"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
      {/* Cloudflare Turnstile Script */}
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    </div>
  );
}
