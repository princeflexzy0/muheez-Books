"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the token in the URL hash — getSession picks it up automatically
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else setError("Invalid or expired reset link. Please request a new one.");
    });
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Min. 6 characters"); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", textAlign: "center", marginBottom: 32 }}>
          MuheezTalks
        </Link>
        <div style={{ background: "var(--slate)", borderRadius: 16, padding: 40, border: "1px solid #2D3748" }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: "var(--ivory)", marginBottom: 12 }}>Password updated!</h1>
              <p style={{ color: "#6B7280", fontSize: 14 }}>Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>New password</h1>
              <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 14 }}>Choose a strong password</p>
              {error && (
                <div style={{ background: "#2D1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
                  {error} {!ready && <Link href="/auth/forgot-password" style={{ color: "var(--amber)", textDecoration: "none" }}>Request new link →</Link>}
                </div>
              )}
              {ready && (
                <form onSubmit={handleReset}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>New Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                      style={{ width: "100%", background: "var(--navy)", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                      placeholder="Min. 6 characters" />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Confirm Password</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                      style={{ width: "100%", background: "var(--navy)", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                      placeholder="Repeat password" />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width: "100%", background: "var(--amber)", color: "#000", padding: "13px 0", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
