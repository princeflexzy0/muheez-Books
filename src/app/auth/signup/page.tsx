"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "user",
      });
      // Send welcome email
      await fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: fullName }),
      });
    }
    router.push("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--amber)", textDecoration: "none", display: "block", textAlign: "center", marginBottom: 32 }}>
          MuheezTalks
        </Link>
        <div style={{ background: "var(--slate)", borderRadius: 16, padding: 40, border: "1px solid #2D3748" }}>
          <Link href="/" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13, display: "block", marginBottom: 20 }}>← Back to home</Link>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>Create account</h1>
          <p style={{ color: "#6B7280", marginBottom: 32, fontSize: 14 }}>Join thousands of readers today</p>
          {error && <div style={{ background: "#2D1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{error}</div>}
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                autoComplete="name"
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                placeholder="John Doe" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                autoComplete="email"
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                autoComplete="new-password"
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 15, outline: "none" }}
                placeholder="Min. 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: "var(--amber)", color: "#000", padding: "13px 0", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign: "center", color: "#6B7280", fontSize: 13, marginTop: 24 }}>
            By signing up you agree to our{" "}
            <Link href="/terms" style={{ color: "var(--amber)", textDecoration: "none" }}>Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "var(--amber)", textDecoration: "none" }}>Privacy Policy</Link>
          </p>
          <p style={{ textAlign: "center", color: "#6B7280", fontSize: 14, marginTop: 16 }}>
            Already have an account? <Link href="/auth/login" style={{ color: "var(--amber)", textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
