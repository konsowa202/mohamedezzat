"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addResource(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Unauthorized");
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
  const file = formData.get("file") as File | null;
  let file_url = formData.get("file_url") as string | null;

  // Handle direct file upload if provided
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${slug}-${Date.now()}.${fileExt}`;
    
    // Convert Web File to Buffer for the Node.js server
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return { error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(fileName);
      
    file_url = publicUrl;
  }

  const { error } = await supabase
    .from("resources")
    .insert({ title, slug, description, type, price, file_url });

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/resources");
  return { success: true };
}

export async function deleteResource(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Unauthorized");
    return;
  }

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/resources");
}
