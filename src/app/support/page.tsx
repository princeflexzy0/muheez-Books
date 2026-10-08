"use client";
import { useState } from "react";
import Link from "next/link";

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Something went wrong"); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "var(--navy)", border: "1px solid #374151",
    borderRadius: 8, padding: "12px 16px", color: "var(--ivory)",
    fontSize: 14, outline: "none", fontFamily: "var(--font-inter)",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)" }}>
      <nav style={{ background: "var(--slate)", borderBottom: "1px solid #2D3748", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/store" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>MuheezTalks</Link>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>Home</Link>
          <Link href="/auth/login" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>Login</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px" }}>
        {done ? (
          <div style={{ background: "var(--slate)", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #2D3748" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📬</div>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>Message sent!</h1>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              We've received your message and sent a confirmation to <span style={{ color: "var(--amber)" }}>{form.email}</span>. We'll get back to you soon.
            </p>
            <Link href="/" style={{ background: "var(--amber)", color: "#000", padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>Support</h1>
              <p style={{ color: "var(--muted)", fontSize: 15 }}>Got an issue or question? We'll respond within 24 hours.</p>
            </div>

            <div style={{ background: "var(--slate)", borderRadius: 20, padding: 40, border: "1px solid #2D3748" }}>
              {error && (
                <div style={{ background: "#2D1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Your Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inp} placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inp} placeholder="you@example.com" />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Subject</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inp} placeholder="e.g. Payment issue, Can't access book..." />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={6}
                    style={{ ...inp, resize: "vertical" }}
                    placeholder="Describe your issue in detail..." />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: "var(--amber)", color: "#000", padding: "14px 0", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            </div>

            <div style={{ marginTop: 32, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { icon: "📧", label: "Email", val: "muheeztalks@gmail.com" },
                { icon: "⏱️", label: "Response time", val: "Within 24 hours" },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13 }}>
                  <span>{icon}</span>
                  <span><strong style={{ color: "var(--ivory)" }}>{label}:</strong> {val}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
