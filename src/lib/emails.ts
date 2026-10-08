import { Resend } from "resend";

const FROM = "MuheezTalks <onboarding@resend.dev>";
const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to MuheezTalks! 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0E1A;color:#F5F0E8">
        <h1 style="color:#F5A623;font-size:28px">Welcome, ${name}! 🎉</h1>
        <p style="font-size:16px;line-height:1.6">You just joined <strong>MuheezTalks</strong> — the home of books that actually change how you think and earn.</p>
        <p style="font-size:16px;line-height:1.6">Explore our library and grab your first book today.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://muheez-books-production.up.railway.app'}/dashboard" 
           style="display:inline-block;background:#F5A623;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:20px 0">
          Go to My Library →
        </a>
        <p style="color:#6B7280;font-size:13px;margin-top:32px">— Muheez</p>
      </div>
    `,
  });
}

export async function sendPurchaseEmail(email: string, name: string, bookTitle: string, amount: number) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `You just got: ${bookTitle} 📚`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0E1A;color:#F5F0E8">
        <h1 style="color:#F5A623">Purchase Confirmed! 🎉</h1>
        <p style="font-size:16px">Hey ${name}, you now own <strong>${bookTitle}</strong>.</p>
        <div style="background:#1E2535;border-radius:8px;padding:20px;margin:20px 0">
          <p style="margin:0;color:#9CA3AF;font-size:13px">AMOUNT PAID</p>
          <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#F5A623">₦${amount.toLocaleString()}</p>
        </div>
        <p style="font-size:16px">Head to your library to start reading or download your copy.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://muheez-books-production.up.railway.app'}/dashboard"
           style="display:inline-block;background:#F5A623;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:20px 0">
          Read Now →
        </a>
        <p style="color:#6B7280;font-size:13px;margin-top:32px">— Muheez</p>
      </div>
    `,
  });
}

export async function sendPasswordChangeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Your MuheezTalks password was changed",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0E1A;color:#F5F0E8">
        <h1 style="color:#F5A623">Password Changed 🔐</h1>
        <p style="font-size:16px">Hey ${name}, your MuheezTalks password was just changed.</p>
        <p style="font-size:16px">If you did not do this, contact us immediately at <a href="mailto:muheeztalks@gmail.com" style="color:#F5A623">muheeztalks@gmail.com</a>.</p>
        <p style="color:#6B7280;font-size:13px;margin-top:32px">— Muheez</p>
      </div>
    `,
  });
}
