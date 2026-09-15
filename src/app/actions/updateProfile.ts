"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData): Promise<{ success: boolean; error?: string; message?: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const fullName = formData.get("fullName") as string;
  const password = formData.get("password") as string;

  try {
    if (fullName) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (profileError) throw new Error(profileError.message);
    }

    if (password) {
      const { error: authError } = await supabase.auth.updateUser({
        password: password
      });

      if (authError) throw new Error(authError.message);
    }

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Profile updated successfully." };

  } catch (err: any) {
    console.error("Profile update failed:", err);
    return { success: false, error: err.message || "Failed to update profile." };
  }
}
