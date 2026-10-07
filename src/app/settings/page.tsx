"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [tab, setTab] = useState<"profile" | "password" | "danger">("profile");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [deleteInput, setDeleteInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user;
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setFullName(prof?.full_name || "");
      setUsername(prof?.username || "");
      setLoading(false);
    }
    load();
  }, [router]);

  const toast = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  };

  async function saveProfile() {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, username }).eq("id", user.id);
    setSaving(false);
    if (error) toast(error.message, false);
    else toast("Profile updated ✅");
  }

  async function savePassword() {
    if (newPass !== confirmPass) { toast("Passwords don't match", false); return; }
    if (newPass.length < 6) { toast("Min. 6 characters", false); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSaving(false);
    if (error) toast(error.message, false);
    else { toast("Password changed ✅"); setNewPass(""); setConfirmPass(""); }
  }

  async function deleteAccount() {
    if (deleteInput !== "DELETE") { toast("Type DELETE to confirm", false); return; }
    setSaving(true);
    await supabase.from("purchases").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.signOut();
    router.push("/");
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "var(--navy)", border: "1px solid #374151",
    borderRadius: 8, padding: "12px 16px", color: "var(--ivory)",
    fontSize: 14, outline: "none", fontFamily: "var(--font-inter)",
  };

  const lbl: React.CSSProperties = {
    color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8,
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: "👤" },
    { key: "password", label: "Password", icon: "🔒" },
    { key: "danger", label: "Danger Zone", icon: "⚠️" },
  ] as const;

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--amber)" }}>Loading...</div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)" }}>
      <nav style={{ background: "var(--slate)", borderBottom: "1px solid #2D3748", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>MuheezTalks</Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/dashboard" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>← Dashboard</Link>
          <Link href="/analytics" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>Analytics</Link>
        </div>
      </nav>

      {msg && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 100, background: msg.ok ? "#0D2D1A" : "#2D1515", border: `1px solid ${msg.ok ? "#166534" : "#7F1D1D"}`, color: msg.ok ? "#86EFAC" : "#FCA5A5", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500 }}>
          {msg.text}
        </div>
      )}

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "var(--ivory)", marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "var(--muted)", marginBottom: 36, fontSize: 14 }}>{user?.email}</p>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {/* SIDEBAR */}
          <div style={{ width: 180, flexShrink: 0 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 6, fontSize: 14, fontWeight: tab === t.key ? 700 : 400, background: tab === t.key ? "var(--slate)" : "transparent", color: tab === t.key ? "var(--ivory)" : "var(--muted)", borderLeft: tab === t.key ? "3px solid var(--amber)" : "3px solid transparent", textAlign: "left" }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* PANEL */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ background: "var(--slate)", borderRadius: 16, padding: 32, border: "1px solid #2D3748" }}>

              {tab === "profile" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--ivory)", marginBottom: 24 }}>Profile Info</h2>
                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>Full Name</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} style={inp} placeholder="Your full name" />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} style={inp} placeholder="@yourhandle" />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={lbl}>Email</label>
                    <input value={user?.email || ""} disabled style={{ ...inp, opacity: 0.5, cursor: "not-allowed" }} />
                    <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>Email cannot be changed here.</p>
                  </div>
                  <button onClick={saveProfile} disabled={saving}
                    style={{ background: "var(--amber)", color: "#000", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {tab === "password" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--ivory)", marginBottom: 24 }}>Change Password</h2>
                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>New Password</label>
                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} style={inp} placeholder="Min. 6 characters" />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={lbl}>Confirm Password</label>
                    <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} style={inp} placeholder="Repeat new password" />
                  </div>
                  <button onClick={savePassword} disabled={saving}
                    style={{ background: "var(--amber)", color: "#000", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              )}

              {tab === "danger" && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#FCA5A5", marginBottom: 8 }}>Delete Account</h2>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Permanent. All your data, purchases and profile will be deleted. No undo.</p>
                  <div style={{ background: "#1A0A0A", border: "1px solid #7F1D1D", borderRadius: 12, padding: 24 }}>
                    <label style={{ ...lbl, color: "#FCA5A5" }}>Type <strong>DELETE</strong> to confirm</label>
                    <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} style={{ ...inp, border: "1px solid #7F1D1D", marginBottom: 16 }} placeholder="DELETE" />
                    <button onClick={deleteAccount} disabled={saving || deleteInput !== "DELETE"}
                      style={{ background: deleteInput === "DELETE" ? "#7F1D1D" : "#2D1515", color: "#FCA5A5", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "1px solid #7F1D1D", cursor: deleteInput === "DELETE" ? "pointer" : "not-allowed", opacity: deleteInput === "DELETE" ? 1 : 0.5 }}>
                      {saving ? "Deleting..." : "Permanently Delete Account"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
