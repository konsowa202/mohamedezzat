"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const athleteAge = parseInt(formData.get("athleteAge") as string);
  const primaryGoal = formData.get("primaryGoal") as string;
  const currentTimes = formData.get("currentTimes") as string;
  const notes = formData.get("notes") as string;
  const turnstileToken = formData.get("cf-turnstile-response");

  if (!fullName || !email || !phone || !athleteAge || !primaryGoal) {
    console.error("Please fill out all required fields.");
    return;
  }

  // TODO: Validate Turnstile token with Cloudflare API
  // if (!turnstileToken) {
  //   return { error: "Security check failed." };
  // }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("applications")
    .insert({
      full_name: fullName,
      email,
      phone,
      athlete_age: athleteAge,
      primary_goal: primaryGoal,
      current_times: currentTimes,
      notes,
    });

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/apply");
}
