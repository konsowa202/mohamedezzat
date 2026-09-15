"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createWorkout(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const exercisesJson = formData.get("exercises") as string;

  if (!title) {
    return { error: "Title is required." };
  }

  let exercises = [];
  try {
    exercises = JSON.parse(exercisesJson || "[]");
  } catch (e) {
    return { error: "Invalid exercises data." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("workouts")
    .insert({
      title,
      description,
      exercises,
      created_by: user.id
    });

  if (error) {
    console.error("Error creating workout:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteWorkout(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) {
    console.error("Error deleting workout:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
