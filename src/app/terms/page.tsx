import Link from "next/link";

export default function Terms() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", marginBottom: 48 }}>← MuheezTalks</Link>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 40, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>Terms of Service</h1>
        <p style={{ color: "#6B7280", marginBottom: 48, fontSize: 14 }}>Last updated: January 2026</p>

        {[
          ["1. Acceptance of Terms", "By accessing or purchasing from MuheezTalks, you agree to be bound by these Terms of Service. If you do not agree, please do not use this platform."],
          ["2. Products & Purchases", "All books and digital products sold on MuheezTalks are for personal use only. Upon successful payment, you will receive access to download or read the purchased content online. All sales are final — no refunds except where required by law."],
          ["3. Intellectual Property", "All content on MuheezTalks — including books, covers, text, and branding — is the intellectual property of Oladiti Abdulmuheez Olayemi. You may not reproduce, redistribute, resell, or share purchased content without written permission."],
          ["4. User Accounts", "You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others or allow unauthorized access to your purchased content."],
          ["5. Payments", "Payments are processed securely via Paystack. MuheezTalks does not store your card details. By completing a purchase, you authorize the charge to your selected payment method."],
          ["6. Prohibited Use", "You may not use MuheezTalks for any unlawful purpose, to pirate content, impersonate others, or attempt to gain unauthorized access to admin areas or other users' accounts."],
          ["7. Disclaimer", "Books on MuheezTalks are for educational and informational purposes only. Results mentioned by readers are not guaranteed. MuheezTalks is not liable for financial decisions made based on content in its books."],
          ["8. Changes to Terms", "We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms."],
          ["9. Contact", "For questions about these terms, email us at muheeztalks@gmail.com"],
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
