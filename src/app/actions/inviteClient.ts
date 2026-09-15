"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function inviteClient(prevState: any, formData: FormData): Promise<{ success: boolean; error?: string; message?: string }> {
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !fullName) {
    return { success: false, error: "Email and Full Name are required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    return { success: false, error: "Service role key is not configured. Cannot invite users." };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Invite user via Supabase Auth Admin API
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName }
  });

  if (error) {
    console.error("Error inviting client:", error);
    return { success: false, error: error.message };
  }

  // Set role to 'client' explicitly just in case trigger doesn't do it quickly enough, 
  // or we can just rely on the database trigger `handle_new_user` which sets it to 'client' by default.

  revalidatePath('/admin');
  
  return { 
    success: true, 
    message: `Invite successfully sent to ${email}. They have been added as a client.` 
  };
}
