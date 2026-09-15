"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ==========================================
// SITE SETTINGS (HERO & CONTENT)
// ==========================================

export async function getSiteSettings(sectionKey: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("site_settings")
    .select("content")
    .eq("section_key", sectionKey)
    .single();

  if (error || !data) {
    return null;
  }
  return data.content;
}

export async function updateSiteSettings(sectionKey: string, content: any) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error("Unauthorized");

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { section_key: sectionKey, content, updated_at: new Date().toISOString() },
      { onConflict: "section_key" }
    );

  if (error) {
    console.error("Error updating site settings:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/admin");
  return { success: true };
}

// ==========================================
// CLIENT RESULTS (SUCCESS STORIES)
// ==========================================

export async function addClientResult(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error("Unauthorized");

  const client_name = formData.get("client_name") as string;
  const achievement = formData.get("achievement") as string;
  const image_url = formData.get("image_url") as string;

  if (!client_name || !achievement || !image_url) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase
    .from("client_results")
    .insert([{ client_name, achievement, image_url }]);

  if (error) {
    console.error("Error adding client result:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/results");
  revalidatePath("/ar/results");
  revalidatePath("/admin");
  
  return { success: true };
}

export async function deleteClientResult(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error("Unauthorized");

  const { error } = await supabase
    .from("client_results")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/results");
  revalidatePath("/ar/results");
  revalidatePath("/admin");
}
