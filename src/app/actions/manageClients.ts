"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function grantUserAsset(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Unauthorized");
    return;
  }

  const user_id = formData.get("user_id") as string;
  const asset_type = formData.get("asset_type") as string;
  const asset_name = formData.get("asset_name") as string;
  const resource_id = formData.get("resource_id") ? formData.get("resource_id") as string : null;
  const expires_at = formData.get("expires_at") ? new Date(formData.get("expires_at") as string).toISOString() : null;

  const { error } = await supabase
    .from("user_assets")
    .insert({
      user_id,
      asset_type,
      asset_name,
      resource_id,
      expires_at
    });

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/admin");
}

export async function revokeUserAsset(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Unauthorized");
    return;
  }

  const { error } = await supabase.from("user_assets").delete().eq("id", id);
  
  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/admin");
}
