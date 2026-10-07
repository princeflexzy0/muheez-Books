"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", textAlign: "center", marginBottom: 32 }}>
          MuheezTalks
        </Link>
        <div style={{ background: "var(--slate)", borderRadius: 16, padding: 40, border: "1px solid #2D3748" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>Check your email</h1>
              <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                We sent a password reset link to <span style={{ color: "var(--amber)" }}>{email}</span>. Check your inbox and click the link.
              </p>
              <Link href="/auth/login" style={{ color: "var(--amber)", textDecoration: "none", fontSize: 14 }}>← Back to login</Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>Reset password</h1>
              <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 14 }}>Enter your email and we'll send a reset link</p>
              {error && <div style={{ background: "#2D1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{error}</div>}
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                    placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: "var(--amber)", color: "#000", padding: "13px 0", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <p style={{ textAlign: "center", color: "#6B7280", fontSize: 14, marginTop: 24 }}>
                Remember it? <Link href="/auth/login" style={{ color: "var(--amber)", textDecoration: "none" }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
