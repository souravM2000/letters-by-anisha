import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// ─── Schema ──────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  inquiryType: z.enum([
    "Brand Collaboration",
    "Press / Media",
    "Book Review Request",
    "General Inquiry",
  ], { message: "Invalid inquiry type" }),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

// ─── Rate limiting note ────────────────────────────────────────────────────
// NOTE: For a production deployment, add a proper rate limiter here.
// Recommended: `@upstash/ratelimit` with Vercel KV, or the `rate-limiter-flexible`
// package with an in-memory store. For this portfolio (free-tier), the Resend
// free plan itself (100 emails/day) acts as a natural throttle. If spam becomes
// an issue, add a simple in-memory Map-based window counter or a CAPTCHA.

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Parse JSON body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Server-side validation
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Validation error.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, email, inquiryType, message } = result.data;

  // Check env vars
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL_TO;

  if (!resendKey || resendKey === "REPLACE_ME") {
    console.error("[contact] RESEND_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 500 }
    );
  }
  if (!toEmail || toEmail === "REPLACE_ME") {
    console.error("[contact] CONTACT_EMAIL_TO is not configured.");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 500 }
    );
  }

  // Send email via Resend
  const resend = new Resend(resendKey);

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Georgia, serif; color: #1F1E1D; background: #FBF8F3; max-width: 600px; margin: 0 auto; padding: 32px;">
        <div style="border-top: 3px solid #77121D; padding-top: 24px; margin-bottom: 32px;">
          <h1 style="font-size: 28px; color: #77121D; margin: 0 0 4px;">Letters by Anisha</h1>
          <p style="color: #9E2A2B; font-size: 14px; margin: 0; font-style: italic;">New contact form submission</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #1F1E1D22; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1F1E1D80; width: 140px;">Inquiry Type</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #1F1E1D22; font-size: 15px; font-weight: 600;">${inquiryType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #1F1E1D22; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1F1E1D80;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #1F1E1D22; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #1F1E1D22; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1F1E1D80;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #1F1E1D22; font-size: 15px;"><a href="mailto:${email}" style="color: #77121D;">${email}</a></td>
          </tr>
        </table>

        <div style="margin-bottom: 32px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1F1E1D80; margin: 0 0 12px;">Message</p>
          <div style="background: #FDFBF7; border-left: 3px solid #9E2A2B; padding: 16px 20px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>

        <p style="font-size: 12px; color: #1F1E1D40; border-top: 1px solid #1F1E1D10; padding-top: 16px;">
          This email was sent via the contact form at lettersbyanisha.com
        </p>
      </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Letters by Anisha <onboarding@resend.dev>", // Replace with your verified domain once set up
      to: [toEmail],
      replyTo: email,
      subject: `[${inquiryType}] from ${name}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
