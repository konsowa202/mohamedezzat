import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ResultsClient from "./ResultsClient";

export default async function ResultsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: clientResults } = await supabase
    .from("client_results")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return <ResultsClient results={clientResults || []} />;
}
