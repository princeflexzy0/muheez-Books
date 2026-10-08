"use client";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const books = [
  { id: 1, title: "The Psychology of Messages", price: "₦4,500", tag: "Bestseller", emoji: "🧠", color: "#2D1B69" },
  { id: 2, title: "The Dangote IPO Opportunity", price: "₦4,500", tag: "Finance", emoji: "📈", color: "#1B3A2D" },
  { id: 3, title: "The AI Income Blueprint", price: "₦22,000", tag: "🔥 Hot", emoji: "🤖", color: "#2D1B1B" },
  { id: 4, title: "The ₦1 Million Digital Products Blueprint", price: "₦4,500", tag: "Digital", emoji: "💻", color: "#1B2D3A" },
  { id: 5, title: "The AI Advantages", price: "₦4,500", tag: "AI", emoji: "⚡", color: "#2D2A1B" },
  { id: 6, title: "How to Make Your First 100,000 Naira", price: "₦4,500", tag: "Money", emoji: "💰", color: "#1B2D1B" },
];

const reviews = [
  { name: "Fatima A.", text: "The AI Blueprint changed how I think about income. Worth every penny.", stars: 5, avatar: "FA" },
  { name: "Chukwuemeka O.", text: "Simple, direct, and actionable. Muheez doesn't waste your time.", stars: 5, avatar: "CO" },
  { name: "Aisha B.", text: "I made back 10x the price of the book in a week. No jokes.", stars: 5, avatar: "AB" },
  { name: "David K.", text: "The Psychology of Messages helped me close 3 clients in a day.", stars: 5, avatar: "DK" },
];

const stats = [
  { val: "6+", label: "Books Published", icon: "🗂️" },
  { val: "500+", label: "Readers", icon: "🌍" },
  { val: "4.9★", label: "Avg Rating", icon: "🏅" },
  { val: "$3", label: "Starting Price", icon: "🎯" },
];

function useAuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, []);
}

export default function Home() {
  useAuthRedirect();
  return (
    <main style={{ fontFamily: "var(--font-inter)", overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{ background: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1E2535", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 8 }}>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>MuheezTalks</Link>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="#books" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: 14 }}>Books</Link>
            <Link href="#reviews" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: 14 }}>Reviews</Link>
            <Link href="/auth/login" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: 14 }}>Login</Link>
            <Link href="/auth/signup" style={{ background: "var(--amber)", color: "#000", padding: "8px 20px", borderRadius: 6, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", padding: "60px 20px", maxWidth: 1200, margin: "0 auto", position: "relative", width: "100%" }}>
        {/* Background graphic */}
        <div style={{ position: "absolute", right: -100, top: "50%", transform: "translateY(-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", color: "var(--amber)", padding: "6px 16px", borderRadius: 20, fontSize: 13, marginBottom: 28, fontWeight: 500 }}>
            <span>🔥</span> Knowledge That Pays
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.1, fontWeight: 700, color: "var(--ivory)", marginBottom: 24 }}>
            Books That Turn<br />
            <span style={{ color: "var(--amber)", position: "relative" }}>Readers Into Earners</span>
          </h1>
          <p style={{ fontSize: 18, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
            Practical blueprints on AI, finance, digital products, and mindset — written by Muheez for people ready to move differently.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/auth/signup" style={{ background: "var(--amber)", color: "#000", padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>
              Start Reading →
            </Link>
            <Link href="/auth/login" style={{ border: "1px solid #374151", color: "var(--ivory)", padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 40 }}>
            {stats.map(({ val, label, icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, background: "var(--slate)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid #2D3748" }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        </section>

      {/* WHY MUHEEZTALKS */}
      <section style={{ padding: "80px 24px", background: "#0D1120" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 700, color: "var(--ivory)", marginBottom: 48, textAlign: "center" }}>Why MuheezTalks?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { icon: "⚡", title: "Instant Access", desc: "Pay once, get your book immediately. No waiting, no delays." },
              { icon: "📱", title: "Read Anywhere", desc: "Read online in your browser or download to any device." },
              { icon: "💡", title: "Practical Content", desc: "No fluff. Every book is a blueprint you can act on today." },
              { icon: "🔒", title: "Secure Payments", desc: "Powered by Paystack. Your money and data are safe." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "var(--slate)", borderRadius: 14, padding: 28, border: "1px solid #2D3748", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, background: "rgba(245,166,35,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>{icon}</div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKS */}
      <section id="books" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>The Collection</h2>
              <p style={{ color: "#6B7280" }}>Every book is a shortcut someone paid for with time. You get it for $3.</p>
            </div>
            <Link href="/auth/signup" style={{ background: "transparent", border: "1px solid var(--amber)", color: "var(--amber)", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
              View All →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {books.map((book) => (
              <div key={book.id}
                style={{ background: "var(--slate)", borderRadius: 16, overflow: "hidden", border: "1px solid #2D3748", transition: "transform 0.2s, border-color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2D3748"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {/* Book cover graphic */}
                <div style={{ width: "100%", height: 180, background: `linear-gradient(135deg, ${book.color} 0%, #0A0E1A 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <img src={`https://picsum.photos/seed/${book.id}book/400/300`} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                  <div style={{ position: "absolute", top: 12, left: 12, background: "var(--amber)", color: "#000", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4 }}>{book.tag}</div>
                  <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>{book.price}</div>
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700, color: "var(--ivory)", marginBottom: 16, lineHeight: 1.4 }}>{book.title}</h3>
                  <Link href="/auth/signup" style={{ display: "block", textAlign: "center", background: "var(--amber)", color: "#000", padding: "10px 0", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                    Get Access
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: "80px 24px", background: "#0D1120" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>What Readers Say</h2>
          <p style={{ color: "#6B7280", marginBottom: 48 }}>Real people. Real results.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: "var(--slate)", borderRadius: 14, padding: 28, border: "1px solid #2D3748" }}>
                <div style={{ color: "var(--amber)", fontSize: 16, marginBottom: 16, letterSpacing: 2 }}>{"★".repeat(r.stars)}</div>
                <p style={{ color: "#D1D5DB", fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: "var(--amber)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000" }}>{r.avatar}</div>
                  <span style={{ fontWeight: 600, color: "var(--ivory)", fontSize: 14 }}>{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(245,166,35,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "var(--ivory)", marginBottom: 16, position: "relative" }}>
          Ready to Invest in Yourself?
        </h2>
        <p style={{ color: "#6B7280", marginBottom: 36, fontSize: 18, position: "relative" }}>Join hundreds of readers already using these blueprints.</p>
        <Link href="/auth/signup" style={{ background: "var(--amber)", color: "#000", padding: "16px 48px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 18, position: "relative" }}>
          Start Reading Today →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#080B14", borderTop: "1px solid #1E2535", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", marginBottom: 4 }}>MuheezTalks</div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>Knowledge That Pays</div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/terms" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13 }}>Terms</Link>
              <Link href="/privacy" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13 }}>Privacy</Link>
              <Link href="/legal" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13 }}>Legal</Link><Link href="/support" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13 }}>Support</Link>
              <Link href="/auth/login" style={{ color: "#6B7280", textDecoration: "none", fontSize: 13 }}>Login</Link>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1E2535", paddingTop: 24, color: "#6B7280", fontSize: 13, textAlign: "center" }}>
            © 2026 MuheezTalks by Oladiti Abdulmuheez Olayemi. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
