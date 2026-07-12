import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return new NextResponse("Resource slug is required", { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch the resource details from the database
  const { data: resource, error } = await supabase
    .from("resources")
    .select("file_url, title")
    .eq("slug", slug)
    .single();

  if (error || !resource || !resource.file_url) {
    return new NextResponse("Resource not found", { status: 404 });
  }

  try {
    // Fetch the file directly from Supabase Storage
    const response = await fetch(resource.file_url);

    if (!response.ok) {
      return new NextResponse("Failed to fetch file from storage", { status: 500 });
    }

    const blob = await response.blob();
    const contentType = response.headers.get("Content-Type") || "application/pdf";

    // Return the blob with appropriate headers to view it in the browser
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(resource.title)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Error serving resource file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
