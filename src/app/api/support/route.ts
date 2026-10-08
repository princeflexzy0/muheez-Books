import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    await resend.emails.send({
      from: "MuheezTalks Support <onboarding@resend.dev>",
      to: "muheeztalks@gmail.com",
      replyTo: email,
      subject: `[Support] ${subject || "New message"} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#F5A623">New Support Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject || "—"}</p>
          <hr style="border-color:#eee;margin:20px 0"/>
          <p style="white-space:pre-wrap">${message}</p>
          <hr style="border-color:#eee;margin:20px 0"/>
          <p style="color:#999;font-size:12px">Sent via MuheezTalks support form</p>
        </div>
      `,
    });

    // also send confirmation to user
    await resend.emails.send({
      from: "MuheezTalks <onboarding@resend.dev>",
      to: email,
      subject: "We got your message — MuheezTalks Support",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#F5A623">Hey ${name}, we got your message!</h2>
          <p>Thanks for reaching out. We'll get back to you at <strong>${email}</strong> as soon as possible.</p>
          <p style="color:#666">Your message:</p>
          <blockquote style="border-left:3px solid #F5A623;padding-left:16px;color:#444;margin:16px 0">
            ${message}
          </blockquote>
          <p>— Muheez</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
