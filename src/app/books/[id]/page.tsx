"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

declare global { interface Window { PaystackPop: any; } }

export default function BookPage() {
  const [book, setBook] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    document.head.appendChild(script);
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      setUser(user);
      const { data: book } = await supabase.from("books").select("*").eq("id", id).single();
      setBook(book);
      if (user) {
        const { data: purchase } = await supabase.from("purchases").select("id").eq("user_id", user.id).eq("book_id", id).eq("status", "completed").single();
        setPurchased(!!purchase);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  async function handleBuy() {
    if (!user) { router.push("/auth/login"); return; }
    setPaying(true);
    if (book.price === 0) {
      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: `free_${Date.now()}`, bookId: book.id, userId: user.id, amount: 0 }),
      });
      if (res.ok) { setPurchased(true); router.push("/dashboard"); }
      setPaying(false);
      return;
    }
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: Math.round(book.price * 100),
      currency: "NGN",
      ref: `muheez_${Date.now()}`,
      onSuccess: async (transaction: any) => {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: transaction.reference, bookId: book.id, userId: user.id, amount: book.price }),
        });
        if (res.ok) { setPurchased(true); router.push("/dashboard"); }
        setPaying(false);
      },
      onCancel: () => setPaying(false),
    });
    handler.openIframe();
  }

  if (loading) return <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "var(--amber)" }}>Loading...</div></main>;
  if (!book) return <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "var(--ivory)" }}>Book not found</div></main>;

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)" }}>
      <nav style={{ background: "#0D1120", borderBottom: "1px solid #1E2535", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)", textDecoration: "none" }}>MuheezTalks</Link>
        <Link href={user ? "/dashboard" : "/auth/login"} style={{ color: "var(--ivory)", textDecoration: "none", fontSize: 14 }}>{user ? "My Library" : "Login"}</Link>
      </nav>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <Link href="/store" style={{ color: "#6B7280", textDecoration: "none", fontSize: 14, marginBottom: 32, display: "block" }}>← Back to store</Link>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 48, alignItems: "start" }}>
          <div style={{ background: "linear-gradient(135deg, #1a2040 0%, #0A0E1A 100%)", borderRadius: 12, height: 360, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2D3748" }}>
            {book.cover_url ? <img src={book.cover_url} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} /> : <span style={{ fontSize: 64 }}>📖</span>}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "var(--ivory)", marginBottom: 16, lineHeight: 1.3 }}>{book.title}</h1>
            <p style={{ color: "#9CA3AF", lineHeight: 1.8, fontSize: 16, marginBottom: 28 }}>{book.description || "A powerful blueprint to transform how you think and earn."}</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              {book.read_online && <span style={{ background: "#0D2D1A", color: "#86EFAC", padding: "4px 12px", borderRadius: 20, fontSize: 13 }}>📱 Read Online</span>}
              {book.downloadable && <span style={{ background: "#0D1F3C", color: "#93C5FD", padding: "4px 12px", borderRadius: 20, fontSize: 13 }}>⬇️ Downloadable</span>}
            </div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 40, fontWeight: 700, color: "var(--amber)", marginBottom: 28 }}>₦{book.price}</div>
            {purchased ? (
              <div style={{ display: "flex", gap: 12 }}>
                {book.read_online && <Link href={`/read/${book.id}`} style={{ background: "var(--amber)", color: "#000", padding: "14px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>Read Now</Link>}
                {book.downloadable && <Link href={`/api/download/${book.id}`} style={{ background: "#1E2535", color: "var(--ivory)", padding: "14px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 15, border: "1px solid #374151" }}>Download</Link>}
              </div>
            ) : (
              <button onClick={handleBuy} disabled={paying} style={{ background: "var(--amber)", color: "#000", padding: "14px 40px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
                {paying ? "Processing..." : book.price === 0 ? "Get Free" : `Buy for ₦${book.price}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
