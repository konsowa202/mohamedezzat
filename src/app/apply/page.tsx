"use client";

import { useActionState, useState, useEffect } from "react";
import { submitApplication } from "@/app/actions/submitApplication";
import { ChevronRight, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import Script from "next/script";

const initialState: { success: boolean; error?: string; message?: string } = {
  success: false,
};

export default function ApplyPage() {
  const [state, formAction, isPending] = useActionState(submitApplication, initialState);
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Basic validation before allowing next step
  const handleNext = () => {
    // We could add robust client-side validation here, but for now we just advance
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  if (state?.success) {
    return (
      <div className="min-h-screen bg-[#06060A] pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-10 rounded-3xl shadow-card-deep text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Application Received</h2>
          <p className="text-[#5B7186] mb-8">
            {state.message || "Your application has been successfully submitted! We will be in touch soon."}
          </p>
          <a
            href="/"
            className="inline-block rounded-xl bg-white/5 border border-white/10 px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060A] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
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

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">Step {step} of {totalSteps}</span>
            <span className="text-xs font-bold text-[#5B7186]">
              {step === 1 && "Athlete Info"}
              {step === 2 && "Swimming Profile"}
              {step === 3 && "Goals & Performance"}
              {step === 4 && "Training Access"}
              {step === 5 && "Health & Considerations"}
              {step === 6 && "Review & Submit"}
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div 
              className="bg-[#38BDF8] h-2 rounded-full transition-all duration-500 shadow-glow-blue-sm" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0a2d54]/20 border border-[#38BDF8]/10 p-8 sm:p-10 rounded-3xl shadow-card-deep">
          
          {state?.error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium animate-in fade-in">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            
            {/* STEP 1: Athlete Information */}
            <div className={step === 1 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <h2 className="text-xl font-bold text-white mb-6">1. Athlete Information</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required={step === 1}
                    className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      required={step === 1}
                      className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="athleteAge" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      id="athleteAge"
                      name="athleteAge"
                      required={step === 1}
                      min="5"
                      max="99"
                      className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Swimming Profile */}
            <div className={step === 2 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <h2 className="text-xl font-bold text-white mb-6">2. Swimming Profile & Contact</h2>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required={step === 2}
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
                      required={step === 2}
                      className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="club" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                      Swimming Club / Team
                    </label>
                    <input
                      type="text"
                      id="club"
                      name="club"
                      className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="swimmingLevel" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                      Competition Level
                    </label>
                    <select
                      id="swimmingLevel"
                      name="swimmingLevel"
                      className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors appearance-none"
                    >
                      <option value="">Select level...</option>
                      <option value="Age Group">Age Group</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                      <option value="Masters">Masters</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Goals & Performance */}
            <div className={step === 3 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <h2 className="text-xl font-bold text-white mb-6">3. Goals & Performance</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="swimmingDiscipline" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Main Discipline / Events
                  </label>
                  <input
                    type="text"
                    id="swimmingDiscipline"
                    name="swimmingDiscipline"
                    placeholder="e.g. 50m Free, 100m Fly"
                    className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="primaryGoals" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Primary Goal
                  </label>
                  <select
                    id="primaryGoals"
                    name="primaryGoals"
                    required={step === 3}
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
              </div>
            </div>

            {/* STEP 4: Training */}
            <div className={step === 4 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <h2 className="text-xl font-bold text-white mb-6">4. Training Access</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="preferredTrainingFrequency" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Preferred Training Frequency
                  </label>
                  <select
                    id="preferredTrainingFrequency"
                    name="preferredTrainingFrequency"
                    className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors appearance-none"
                  >
                    <option value="">Select frequency...</option>
                    <option value="1x/week">1x per week</option>
                    <option value="2x/week">2x per week</option>
                    <option value="3x+/week">3+ per week</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="gymAccess" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Gym / Equipment Access
                  </label>
                  <input
                    type="text"
                    id="gymAccess"
                    name="gymAccess"
                    placeholder="e.g. Full commercial gym, home gym, no equipment"
                    className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* STEP 5: Health & Considerations */}
            <div className={step === 5 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <h2 className="text-xl font-bold text-white mb-6">5. Health & Considerations</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="currentInjuries" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Current or Past Injuries (Optional)
                  </label>
                  <textarea
                    id="currentInjuries"
                    name="currentInjuries"
                    rows={3}
                    placeholder="List any injuries or physical limitations..."
                    className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-[#5B7186] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Anything else we should know?"
                    className="w-full bg-[#06060A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* STEP 6: Review & Submit */}
            <div className={step === 6 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
              <h2 className="text-xl font-bold text-white mb-6">6. Review & Submit</h2>
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                  <p className="text-sm text-[#5B7186] mb-4">
                    Please ensure all your information is correct. Once submitted, we will review your application and get back to you to discuss the next steps.
                  </p>
                  
                  {/* Turnstile Container */}
                  <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full rounded-xl bg-[#38BDF8] px-8 py-4 text-sm font-black text-[#06060A] transition-all shadow-glow-blue flex items-center justify-center gap-2 ${
                    isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-[#38BDF8]/90"
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1 || isPending}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors ${
                  step === 1 ? "opacity-0 pointer-events-none" : "text-white bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
              >
                <ChevronLeft size={16} /> Back
              </button>
              
              {step < totalSteps && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#06060A] bg-[#38BDF8] hover:bg-[#38BDF8]/90 shadow-glow-blue-sm transition-all"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
      
      {/* Cloudflare Turnstile Script */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
    </div>
  );
}
