import Link from "next/link";

export default function Privacy() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/store" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", marginBottom: 48 }}>← MuheezTalks</Link>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 40, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ color: "#6B7280", marginBottom: 48, fontSize: 14 }}>Last updated: January 2026</p>

        {[
          ["1. Information We Collect", "We collect your name, email address, and purchase history when you create an account or make a purchase. We do not collect payment card details — these are handled directly by Paystack."],
          ["2. How We Use Your Information", "Your information is used to: create and manage your account, process purchases and grant book access, send order confirmations and important updates, and improve the MuheezTalks platform."],
          ["3. Data Storage", "Your data is stored securely using Supabase, a PostgreSQL-based platform with industry-standard encryption. We do not sell or rent your personal data to third parties."],
          ["4. Cookies", "MuheezTalks uses essential cookies to keep you logged in and maintain your session. We do not use tracking or advertising cookies."],
          ["5. Third-Party Services", "We use Paystack for payment processing and Supabase for data storage. Each has their own privacy policy governing how they handle your data."],
          ["6. Your Rights", "You have the right to access, update, or delete your personal data at any time. Contact us at muheeztalks@gmail.com to make a request."],
          ["7. Children's Privacy", "MuheezTalks is not intended for users under the age of 13. We do not knowingly collect data from children."],
          ["8. Contact", "For privacy concerns, contact us at muheeztalks@gmail.com"],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>{title}</h2>
            <p style={{ color: "#9CA3AF", lineHeight: 1.8, fontSize: 15 }}>{body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
