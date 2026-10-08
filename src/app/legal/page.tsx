import Link from "next/link";

export default function Legal() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/store" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", marginBottom: 48 }}>← MuheezTalks</Link>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 40, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>Legal Notice</h1>
        <p style={{ color: "#6B7280", marginBottom: 48, fontSize: 14 }}>Last updated: January 2026</p>

        {[
          ["Business Owner", "MuheezTalks is owned and operated by Oladiti Abdulmuheez Olayemi, based in Nigeria."],
          ["Platform Purpose", "MuheezTalks is a digital bookstore selling educational content in the form of eBooks and digital blueprints. All content is created by Oladiti Abdulmuheez Olayemi."],
          ["No Financial Advice", "Content sold on MuheezTalks is for educational purposes only and does not constitute financial, legal, or professional advice. Always consult a qualified professional before making financial decisions."],
          ["Copyright Notice", "© 2026 MuheezTalks. All rights reserved. Unauthorized reproduction or distribution of any content from this platform is strictly prohibited and may result in legal action."],
          ["Governing Law", "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under Nigerian jurisdiction."],
          ["DMCA & Piracy", "We take intellectual property seriously. If you believe your copyright has been infringed, contact us at muheeztalks@gmail.com with details of the claim."],
          ["Contact", "Email: muheeztalks@gmail.com"],
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
