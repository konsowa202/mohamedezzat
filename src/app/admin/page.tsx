import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { count: visitsCount }, 
    { count: leadsCount, data: leads }, 
    { data: applications },
    { data: resources },
    { data: profiles },
    { data: userAssets }
  ] = await Promise.all([
    supabase.from("visit_logs").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("email", { count: "exact" }),
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
    supabase.from("resources").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*"),
    supabase.from("user_assets").select("*")
  ]);

  const emailsList = leads?.map((l) => l.email).join(", ") || "";
  const stats = {
    visitsCount,
    leadsCount,
    applicationsCount: applications?.length || 0,
  };

  return (
    <DashboardClient 
      stats={stats}
      applications={applications || []}
      resources={resources || []}
      profiles={profiles || []}
      userAssets={userAssets || []}
      emailsList={emailsList}
    />
  );
}
