"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitLead(formData: FormData) {
  const email = formData.get("email") as string;
  const slug = formData.get("slug") as string;
  const turnstileToken = formData.get("cf-turnstile-response");

  if (!email || !slug) {
    console.error("Email and resource slug are required.");
    return;
  }

  // TODO: Validate Turnstile token with Cloudflare API
  // if (!turnstileToken) {
  //   return { error: "Security check failed." };
  // }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("leads")
    .insert({
      email,
      resource_slug: slug,
    });

  if (error) {
    if (error.code === '23505') { // Unique violation
       console.error("You already have access to this resource.");
       return;
    }
    console.error(error.message);
    return;
  }

  revalidatePath(`/resources/${slug}`);
}
