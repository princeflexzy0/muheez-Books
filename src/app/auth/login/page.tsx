"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }

    // fetch profile with 4s timeout fallback
    try {
      const profilePromise = supabase.from("profiles").select("role").eq("id", data.user.id).single();
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ data: null }), 4000));
      const { data: profile } = await Promise.race([profilePromise, timeoutPromise]) as any;
      if (profile?.role === "admin") window.location.href = "/admin";
      else window.location.href = "/dashboard";
    } catch {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", textAlign: "center", marginBottom: 32 }}>
          MuheezTalks
        </Link>
        <div style={{ background: "var(--slate)", borderRadius: 16, padding: 40, border: "1px solid #2D3748" }}>
          <Link href="/" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13, display: "block", marginBottom: 20 }}>← Back to home</Link>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 14 }}>Sign in to access your books</p>
          {error && (
            <div style={{ background: "#2D1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                autoComplete="email"
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                autoComplete="current-password"
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                placeholder="••••••••" />
            </div>
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <Link href="/auth/forgot-password" style={{ color: "var(--amber)", fontSize: 13, textDecoration: "none" }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: "var(--amber)", color: "#000", padding: "13px 0", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign: "center", color: "#6B7280", fontSize: 14, marginTop: 24 }}>
            No account? <Link href="/auth/signup" style={{ color: "var(--amber)", textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
