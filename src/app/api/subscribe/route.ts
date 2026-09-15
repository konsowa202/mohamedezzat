import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for backend usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Store the lead in Supabase
    const { error: dbError } = await supabase.from('leads').insert([
      { email, resource_slug: 'core-protocol', delivered_status: false }
    ]);
    
    // Ignore duplicate emails (maybe they just want the email again)
    if (dbError && dbError.code !== '23505') { 
      console.error("Database error saving lead:", dbError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    // 2. Generate a signed URL for the resource from the private bucket (valid for 7 days)
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('resources')
      .createSignedUrl('CoreProtocol.pdf', 60 * 60 * 24 * 7);

    let resourceUrl = "#";
    if (signedUrlError) {
      console.warn("Could not generate signed URL (file may not exist yet). Proceeding with fallback.");
    } else {
      resourceUrl = signedUrlData.signedUrl;
    }

    const emailUser = process.env.EMAIL_USER || "mohamedelhdary321@gmail.com";
    const emailPass = process.env.EMAIL_PASS;

    // Check if the user has configured their app password in .env.local
    if (!emailPass || emailPass === "your_gmail_app_password_here") {
      console.warn("==================================================================");
      console.warn(`[WARNING] Email dispatch skipped because GMAIL APP PASSWORD is not configured.`);
      console.warn(`Please set GMAIL_APP_PASSWORD in your '.env.local' file.`);
      console.warn(`Sender: ${emailUser}`);
      console.warn(`Receiver: ${email}`);
      console.warn(`Generated Link: ${resourceUrl}`);
      console.warn("==================================================================");
      
      // Update delivered status anyway for local mock mode
      await supabase.from('leads').update({ delivered_status: true }).eq('email', email);

      return NextResponse.json({ 
        success: true, 
        simulated: true, 
        message: "SMTP not configured. Running in local mock mode." 
      });
    }

    // Configure SMTP transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass, // App password from Google security settings
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Mohamed Ezzat" <${emailUser}>`,
      to: email,
      subject: "Your Free Swimmer's Core Protocol Guide PDF 🏊‍♂️",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #072244;">Hello Swimmer!</h2>
          <p>Thank you for subscribing to the <strong>Swimmer's Core Protocol</strong>.</p>
          <p>Here is your PDF guide to building core power that actually translates to the water, ensuring faster starts and explosive races.</p>
          <p><em>Note: This secure link will expire in 7 days.</em></p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resourceUrl}" style="background-color: #38BDF8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Download PDF Guide
            </a>
          </div>
          <p>If you have any questions or are ready to take your dryland training to the next level, feel free to book a call with me.</p>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #777777; text-align: center;">
            Mohamed Ezzat S&C Coaching<br/>
            ${emailUser}
          </p>
        </div>
      `,
    });

    // Update delivered status in Supabase
    await supabase.from('leads').update({ delivered_status: true }).eq('email', email);

    console.log(`[SMTP] Email sent successfully from ${emailUser} to ${email}`);
    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Subscription & Email dispatch error:", error);
    return NextResponse.json({ error: "Email dispatch failed" }, { status: 500 });
  }
}
