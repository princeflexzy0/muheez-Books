"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      await new Promise(r => setTimeout(r, 500)); const { data: { session } } = await supabase.auth.getSession(); const user = session?.user;
      if (!user) { router.push("/auth/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      const { data: purch } = await supabase.from("purchases").select("*, books(*)").eq("user_id", user.id).eq("status", "completed");
      setPurchases(purch || []);
      const { data: allBooks } = await supabase.from("books").select("*").order("created_at", { ascending: false });
      setBooks(allBooks || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--amber)" }}>Loading...</div>
    </main>
  );

  const purchasedIds = purchases.map(p => p.book_id);
  const isAdmin = profile?.role === "admin";

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)" }}>
      <nav style={{ background: "var(--slate)", borderBottom: "1px solid #2D3748", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>MuheezTalks</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>Hi, {profile?.full_name?.split(" ")[0] || "Reader"} 👋</span>
          {isAdmin && (
            <Link href="/admin" style={{ background: "var(--amber)", color: "#000", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              ⚙️ Admin
            </Link>
          )}
          <Link href="/analytics" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>Analytics</Link>
          <Link href="/settings" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>Settings</Link>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #374151", color: "var(--ivory)", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>My Library</h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>Books you own</p>

        {purchases.length === 0 ? (
          <div style={{ background: "var(--slate)", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #2D3748", marginBottom: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "var(--ivory)", marginBottom: 8 }}>No books yet</h2>
            <p style={{ color: "var(--muted)" }}>Purchase a book below to get started</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 48 }}>
            {purchases.map((p) => (
              <div key={p.id} style={{ background: "var(--slate)", borderRadius: 12, padding: 24, border: "1px solid #166534" }}>
                <div style={{ width: "100%", height: 100, background: "linear-gradient(135deg, var(--slate) 0%, var(--navy) 100%)", borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.books?.cover_url
                    ? <img src={p.books.cover_url} alt={p.books.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                    : <span style={{ fontSize: 32 }}>📖</span>}
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 700, color: "var(--ivory)", marginBottom: 14, lineHeight: 1.4 }}>{p.books?.title}</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {p.books?.read_online && <Link href={`/read/${p.books.id}`} style={{ flex: 1, textAlign: "center", background: "var(--amber)", color: "#000", padding: "8px 0", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 13 }}>Read</Link>}
                  {p.books?.downloadable && <Link href={`/api/download/${p.books.id}`} style={{ flex: 1, textAlign: "center", background: "var(--navy)", color: "var(--ivory)", padding: "8px 0", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 13, border: "1px solid #374151" }}>Download</Link>}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: "var(--ivory)", marginBottom: 8 }}>The Store</h2>
        <p style={{ color: "var(--muted)", marginBottom: 28 }}>Buy a book to unlock access instantly</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {books.map((book) => {
            const owned = purchasedIds.includes(book.id);
            return (
              <div key={book.id} style={{ background: "var(--slate)", borderRadius: 12, padding: 24, border: `1px solid ${owned ? "#166534" : "#2D3748"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ background: owned ? "#0D2D1A" : "var(--navy)", color: owned ? "#86EFAC" : "var(--amber)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4 }}>
                    {owned ? "✓ Owned" : "Available"}
                  </span>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "var(--amber)" }}>${book.price}</span>
                </div>
                <div style={{ width: "100%", height: 100, background: "linear-gradient(135deg, var(--slate) 0%, var(--navy) 100%)", borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {book.cover_url
                    ? <img src={book.cover_url} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                    : <span style={{ fontSize: 32 }}>📖</span>}
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 700, color: "var(--ivory)", marginBottom: 14, lineHeight: 1.4 }}>{book.title}</h3>
                {owned ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    {book.read_online && <Link href={`/read/${book.id}`} style={{ flex: 1, textAlign: "center", background: "var(--amber)", color: "#000", padding: "8px 0", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 13 }}>Read</Link>}
                    {book.downloadable && <Link href={`/api/download/${book.id}`} style={{ flex: 1, textAlign: "center", background: "var(--navy)", color: "var(--ivory)", padding: "8px 0", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 13, border: "1px solid #374151" }}>Download</Link>}
                  </div>
                ) : (
                  <Link href={`/books/${book.id}`} style={{ display: "block", textAlign: "center", background: "var(--amber)", color: "#000", padding: "9px 0", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                    Buy Now — ${book.price}
                  </Link>
                )}
              </div>
            );
          })}
          {books.length === 0 && <p style={{ color: "var(--muted)", gridColumn: "1/-1" }}>No books available yet.</p>}
        </div>
      </div>
    </main>
  );
}
