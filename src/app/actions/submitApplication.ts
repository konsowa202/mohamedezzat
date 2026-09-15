"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitApplication(prevState: any, formData: FormData): Promise<{ success: boolean; error?: string; message?: string }> {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const athleteAge = parseInt(formData.get("athleteAge") as string) || null;
  const swimmingDiscipline = formData.get("swimmingDiscipline") as string;
  const swimmingLevel = formData.get("swimmingLevel") as string;
  const club = formData.get("club") as string;
  const primaryGoals = formData.get("primaryGoals") as string;
  const gymAccess = formData.get("gymAccess") as string;
  const preferredTrainingFrequency = formData.get("preferredTrainingFrequency") as string;
  const notes = formData.get("notes") as string;

  // Additional fields for form_data JSONB
  const currentTimes = formData.get("currentTimes") as string;
  const currentInjuries = formData.get("currentInjuries") as string;

  const turnstileToken = formData.get("cf-turnstile-response");

  if (!fullName || !email || !phone || !athleteAge || !primaryGoals) {
    return { success: false, error: "Please fill out all required fields." };
  }

  // Validate Turnstile token with Cloudflare API
  if (!turnstileToken) {
    return { success: false, error: "Security check failed. Please verify you are human." };
  }

  const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const secretKey = process.env.TURNSTILE_SECRET_KEY; // Ensure this is set in .env.local

  if (secretKey && secretKey !== "your_turnstile_secret_key_here") {
    try {
      const res = await fetch(verifyEndpoint, {
        method: 'POST',
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(turnstileToken as string)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const data = await res.json();
      if (!data.success) {
         return { success: false, error: "Security verification failed. Please try again." };
      }
    } catch (err) {
      console.error("Turnstile verification error:", err);
      // Fail open if CF is down? Actually, best to fail closed.
      return { success: false, error: "Unable to verify security challenge. Please try again later." };
    }
  } else {
    console.warn("Turnstile secret key not configured, skipping validation.");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("applications")
    .insert({
      full_name: fullName,
      email,
      phone,
      date_of_birth: dateOfBirth || null,
      athlete_age: athleteAge,
      swimming_discipline: swimmingDiscipline || null,
      swimming_level: swimmingLevel || null,
      club: club || null,
      primary_goals: primaryGoals,
      gym_access: gymAccess || null,
      preferred_training_frequency: preferredTrainingFrequency || null,
      notes,
      form_data: {
        current_times: currentTimes || null,
        current_injuries: currentInjuries || null
      }
    });

  if (error) {
    console.error("Supabase insert error:", error);
    // Don't expose internal DB error to user
    return { success: false, error: "An error occurred while submitting your application. Please try again." };
  }

  revalidatePath("/apply");
  return { success: true, message: "Your application has been successfully submitted! We will be in touch soon." };
}
