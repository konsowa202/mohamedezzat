"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/submitLead";

export function ResourceForm({ resource }: { resource: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitLead(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-2xl">
        <h3 className="text-2xl font-bold text-[#38BDF8] mb-2">Success!</h3>
        <p className="text-[#5B7186]">
          {resource.type === 'paid' 
            ? "We have received your request. We will contact you shortly with payment instructions." 
            : "Check your email for the download link!"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Turnstile Container */}
      <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-xl px-8 py-4 text-sm font-black text-[#06060A] transition-all disabled:opacity-50 ${resource.type === 'paid' ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-[#38BDF8] hover:bg-[#38BDF8]/90 shadow-glow-blue'}`}
      >
        {isLoading ? "Processing..." : (resource.type === 'paid' ? 'Apply to Purchase' : 'Download Now')}
      </button>
      
      {resource.type === 'paid' && (
         <p className="text-center text-xs text-[#5B7186] mt-4">We will contact you via email with payment instructions.</p>
      )}
    </form>
  );
}
