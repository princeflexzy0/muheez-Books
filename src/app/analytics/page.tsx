"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const TIERS = [
  { name: "Bookworm", min: 0,   max: 99,   color: "#6B7280", icon: "📖", discount: 0 },
  { name: "Scholar",  min: 100, max: 299,  color: "#3B82F6", icon: "🎓", discount: 5 },
  { name: "Hustler",  min: 300, max: 599,  color: "#8B5CF6", icon: "⚡", discount: 10 },
  { name: "Earner",   min: 600, max: 999,  color: "#F59E0B", icon: "💰", discount: 15 },
  { name: "Legend",   min: 1000,max: 99999,color: "#F5A623", icon: "🏆", discount: 20 },
];

function getTier(pts: number) {
  return TIERS.find(t => pts >= t.min && pts <= t.max) || TIERS[0];
}

function getNextTier(pts: number) {
  const idx = TIERS.findIndex(t => pts >= t.min && pts <= t.max);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

export default function Analytics() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [minutesInput, setMinutesInput] = useState("");
  const [bookInput, setBookInput] = useState("");
  const [purchases, setPurchases] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession(); const user = session?.user;
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      setPoints(prof?.reading_points || 0);

      const { data: sess } = await supabase
        .from("reading_sessions")
        .select("*, books(title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setSessions(sess || []);

      const { data: purch } = await supabase
        .from("purchases")
        .select("*, books(title, id)")
        .eq("user_id", user.id)
        .eq("status", "completed");
      setPurchases(purch || []);

      setLoading(false);
    }
    load();
  }, [router]);

  async function logSession() {
    const mins = parseInt(minutesInput);
    if (!mins || mins < 1) return;
    setLogging(true);
    const earned = Math.floor(mins / 10) * 5; // 5pts per 10 mins

    await supabase.from("reading_sessions").insert({
      user_id: user.id,
      book_id: bookInput || null,
      minutes: mins,
      points_earned: earned,
    });

    const newPoints = points + earned;
    await supabase.from("profiles").update({ reading_points: newPoints }).eq("id", user.id);
    setPoints(newPoints);

    const { data: sess } = await supabase
      .from("reading_sessions")
      .select("*, books(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setSessions(sess || []);

    setMinutesInput("");
    setBookInput("");
    setLogging(false);
  }

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--amber)" }}>Loading...</div>
    </main>
  );

  const tier = getTier(points);
  const next = getNextTier(points);
  const progress = next ? ((points - tier.min) / (next.min - tier.min)) * 100 : 100;
  const totalMins = sessions.reduce((a, s) => a + (s.minutes || 0), 0);
  const totalHours = (totalMins / 60).toFixed(1);
  const discountCode = `MT${tier.name.toUpperCase()}${tier.discount}`;

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)" }}>
      <nav style={{ background: "#0D1120", borderBottom: "1px solid #1E2535", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/dashboard" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>MuheezTalks</Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/dashboard" style={{ color: "#6B7280", fontSize: 13, textDecoration: "none" }}>← Dashboard</Link>
          <Link href="/settings" style={{ color: "#6B7280", fontSize: 13, textDecoration: "none" }}>Settings</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "var(--ivory)", marginBottom: 4 }}>Reading Analytics</h1>
        <p style={{ color: "#6B7280", marginBottom: 36, fontSize: 14 }}>Read more. Earn points. Unlock discounts.</p>

        {/* TIER CARD */}
        <div style={{ background: "var(--slate)", borderRadius: 20, padding: 32, border: `2px solid ${tier.color}`, marginBottom: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.06 }}>{tier.icon}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: `${tier.color}22`, border: `2px solid ${tier.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{tier.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 2 }}>CURRENT RANK</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: tier.color }}>{tier.name}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 700, color: "var(--amber)" }}>{points}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Total Points</div>
            </div>
          </div>

          {/* Progress bar */}
          {next && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#6B7280" }}>
                <span>{points} pts</span>
                <span>{next.min} pts to reach {next.icon} {next.name}</span>
              </div>
              <div style={{ height: 8, background: "#1E2535", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg, ${tier.color}, ${next.color})`, borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
              <p style={{ color: "#6B7280", fontSize: 12, marginTop: 8 }}>{next.min - points} more points to unlock {next.discount}% discount</p>
            </div>
          )}
          {!next && <p style={{ color: "var(--amber)", fontSize: 14, fontWeight: 600 }}>🏆 You've reached the highest tier!</p>}
        </div>

        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Hours Read", val: totalHours, icon: "⏱️" },
            { label: "Sessions", val: sessions.length, icon: "📅" },
            { label: "Points Earned", val: points, icon: "⭐" },
            { label: "Discount", val: tier.discount > 0 ? `${tier.discount}%` : "None yet", icon: "🎁" },
          ].map(({ label, val, icon }) => (
            <div key={label} style={{ background: "var(--slate)", borderRadius: 12, padding: 20, border: "1px solid #2D3748", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--amber)", marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          {/* LOG SESSION */}
          <div style={{ background: "var(--slate)", borderRadius: 16, padding: 28, border: "1px solid #2D3748" }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "var(--ivory)", marginBottom: 6 }}>Log Reading Session</h2>
            <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 20 }}>Every 10 mins = 5 points</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: "#D1D5DB", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>Minutes Read</label>
              <input type="number" min="1" value={minutesInput} onChange={e => setMinutesInput(e.target.value)}
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "10px 14px", color: "var(--ivory)", fontSize: 14, outline: "none" }}
                placeholder="e.g. 30" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#D1D5DB", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>Which Book? (optional)</label>
              <select value={bookInput} onChange={e => setBookInput(e.target.value)}
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "10px 14px", color: bookInput ? "var(--ivory)" : "#6B7280", fontSize: 14, outline: "none" }}>
                <option value="">Select a book...</option>
                {purchases.map(p => <option key={p.books?.id} value={p.books?.id}>{p.books?.title}</option>)}
              </select>
            </div>
            {minutesInput && parseInt(minutesInput) > 0 && (
              <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--amber)" }}>
                You'll earn <strong>+{Math.floor(parseInt(minutesInput) / 10) * 5} points</strong> for {minutesInput} minutes
              </div>
            )}
            <button onClick={logSession} disabled={logging || !minutesInput}
              style={{ width: "100%", background: "var(--amber)", color: "#000", padding: "11px 0", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", opacity: !minutesInput ? 0.5 : 1 }}>
              {logging ? "Logging..." : "Log Session ✓"}
            </button>
          </div>

          {/* DISCOUNT CODE */}
          <div style={{ background: "var(--slate)", borderRadius: 16, padding: 28, border: "1px solid #2D3748" }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "var(--ivory)", marginBottom: 6 }}>Your Discount</h2>
            <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 20 }}>Apply at checkout</p>
            {tier.discount > 0 ? (
              <>
                <div style={{ background: "rgba(245,166,35,0.08)", border: "2px dashed rgba(245,166,35,0.4)", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>YOUR CODE</div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "var(--amber)", letterSpacing: 3 }}>{discountCode}</div>
                  <div style={{ fontSize: 13, color: "#86EFAC", marginTop: 8, fontWeight: 600 }}>{tier.discount}% off your next purchase</div>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(discountCode); }}
                  style={{ width: "100%", background: "#1E2535", color: "var(--ivory)", padding: "11px 0", borderRadius: 8, fontWeight: 600, fontSize: 13, border: "1px solid #374151", cursor: "pointer" }}>
                  Copy Code
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>Reach <strong style={{ color: "var(--ivory)" }}>Scholar</strong> rank (100 pts) to unlock your first discount.</p>
                <p style={{ color: "var(--amber)", fontSize: 13, marginTop: 8, fontWeight: 600 }}>{100 - points} pts to go</p>
              </div>
            )}

            {/* Tier table */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 10 }}>ALL TIERS</div>
              {TIERS.map(t => (
                <div key={t.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1E2535", opacity: points < t.min ? 0.4 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span>{t.icon}</span>
                    <span style={{ color: t.color, fontWeight: 600 }}>{t.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{t.min}+ pts</div>
                  <div style={{ fontSize: 12, color: "#86EFAC", fontWeight: 600 }}>{t.discount > 0 ? `${t.discount}% off` : "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SESSION HISTORY */}
        <div style={{ background: "var(--slate)", borderRadius: 16, padding: 28, border: "1px solid #2D3748" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "var(--ivory)", marginBottom: 20 }}>Session History</h2>
          {sessions.length === 0 ? (
            <p style={{ color: "#6B7280", fontSize: 14 }}>No sessions logged yet. Start reading and log your time!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1E2535" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--ivory)", fontWeight: 500 }}>{s.books?.title || "Free reading"}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "var(--ivory)" }}>{s.minutes} mins</div>
                    <div style={{ fontSize: 11, color: "var(--amber)", fontWeight: 600 }}>+{s.points_earned} pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
