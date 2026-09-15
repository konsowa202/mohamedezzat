"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateAssetStatus(assetId: string, status: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Unauthorized");
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("user_assets")
    .update({ status })
    .eq("id", assetId);

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
