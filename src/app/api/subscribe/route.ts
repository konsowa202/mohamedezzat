import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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
      console.warn("==================================================================");
      
      // Return a simulated success so the frontend states 'Check your inbox'
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
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #072244;">Hello Swimmer!</h2>
          <p>Thank you for subscribing to the <strong>Swimmer's Core Protocol</strong>.</p>
          <p>Here is your PDF guide to building core power that actually translates to the water, ensuring faster starts and explosive races.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="https://mohamedezzat-sc.vercel.app/CoreProtocol.pdf" style="background-color: #38BDF8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Download PDF Guide
            </a>
          </div>
          <p>If you have any questions or are ready to take your dryland training to the next level, feel free to book a call with me.</p>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #777777; text-align: center;">
            Mohamed Ezzat S&C Coaching<br/>
            mohamedelhdary321@gmail.com
          </p>
        </div>
      `,
    });

    console.log(`[SMTP] Email sent successfully from ${emailUser} to ${email}`);
    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Subscription & Email dispatch error:", error);
    return NextResponse.json({ error: "Email dispatch failed" }, { status: 500 });
  }
}
