"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function submitLead(formData: FormData) {
  const email = formData.get("email") as string;
  const slug = formData.get("slug") as string;
  const turnstileToken = formData.get("cf-turnstile-response");

  if (!email || !slug) {
    return { error: "Email and resource slug are required." };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch resource details to send the correct email
  const { data: resource, error: resourceError } = await supabase
    .from("resources")
    .select("title, file_url, type")
    .eq("slug", slug)
    .single();

  if (resourceError || !resource) {
    return { error: `Resource error: ${resourceError?.message || "Not found"} (Slug: ${slug})` };
  }

  const { error } = await supabase
    .from("leads")
    .insert({
      email,
      name: `Resource: ${resource.title}`,
    });

  if (error) {
    if (error.code === '23505') { // Unique violation
       return { error: "You already have access to this resource. Please check your inbox." };
    }
    return { error: `DB Error: ${error.message} (Code: ${error.code})` };
  }

  // Send the email if it's a free resource (paid resources are handled differently)
  if (resource.type !== 'paid' && resource.file_url) {
    try {
      const nodemailer = await import("nodemailer");
      const emailUser = process.env.EMAIL_USER || "mohamedelhdary321@gmail.com";
      const emailPass = process.env.EMAIL_PASS;

      if (emailPass && emailPass !== "your_gmail_app_password_here") {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const headersList = await import("next/headers").then(m => m.headers());
        const host = headersList.get("host") || "mohamedezzat-sc.vercel.app";
        const protocol = host.includes("localhost") ? "http" : "https";
        const downloadUrl = `${protocol}://${host}/api/resources/${slug}`;

        await transporter.sendMail({
          from: `"Mohamed Ezzat" <${emailUser}>`,
          to: email,
          subject: `Your Free Resource: ${resource.title} 🏊‍♂️`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #072244;">Hello!</h2>
              <p>Thank you for requesting <strong>${resource.title}</strong>.</p>
              <p>Here is your requested resource to help you improve your swimming performance.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${downloadUrl}" style="background-color: #38BDF8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View & Download Guide
                </a>
              </div>
              <p>If you have any questions or are ready to take your training to the next level, feel free to reach out.</p>
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #777777; text-align: center;">
                Mohamed Ezzat S&C Coaching<br/>
                mohamedelhdary321@gmail.com
              </p>
            </div>
          `,
        });
      } else {
        console.warn("Skipped email sending because SMTP is not configured properly in .env.local");
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // We don't return error here because the lead is already captured.
    }
  }

  revalidatePath(`/resources/${slug}`);
  return { success: true };
}
