"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ReadPage() {
  const [url, setUrl] = useState("");
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionMins, setSessionMins] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const userRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const savedMinsRef = useRef<number>(0);
  const intervalRef = useRef<any>(null);

  async function logSession(minutes: number) {
    if (!userRef.current || minutes < 1) return;
    const pts = Math.floor(minutes / 10) * 5;
    await supabase.from("reading_sessions").insert({ user_id: userRef.current.id, book_id: id, minutes, points_earned: pts });
    if (pts > 0) {
      const { data: prof } = await supabase.from("profiles").select("reading_points").eq("id", userRef.current.id).single();
      await supabase.from("profiles").update({ reading_points: (prof?.reading_points || 0) + pts }).eq("id", userRef.current.id);
      setPointsEarned(p => p + pts);
    }
  }

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.push("/auth/login"); return; }
      userRef.current = user;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") {
        const { data: purchase } = await supabase.from("purchases").select("id").eq("user_id", user.id).eq("book_id", id).eq("status", "completed").single();
        if (!purchase) { setError("You need to purchase this book first."); setLoading(false); return; }
      }
      const { data: book } = await supabase.from("books").select("*").eq("id", id).single();
      if (!book) { setError("Book not found."); setLoading(false); return; }
      if (!book.read_online) { setError("This book is not available for online reading."); setLoading(false); return; }
      setBook(book);
      const res = await fetch(`/api/download/${id}`);
      if (res.redirected) setUrl(res.url);
      else setError("Could not load book file.");
      setLoading(false);
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(async () => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 60000);
        setSessionMins(elapsed);
        if (elapsed > 0 && elapsed % 10 === 0 && elapsed !== savedMinsRef.current) {
          savedMinsRef.current = elapsed;
          await logSession(10);
        }
      }, 60000);
    }
    if (id) load();
    return () => {
      clearInterval(intervalRef.current);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 60000);
      const remaining = elapsed - savedMinsRef.current;
      if (remaining >= 1) logSession(remaining);
    };
  }, [id]);

  if (loading) return <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "var(--amber)" }}>Loading book...</div></main>;
  if (error) return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <p style={{ color: "var(--ivory)", fontSize: 18 }}>{error}</p>
      <Link href="/" style={{ background: "var(--amber)", color: "#000", padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Go to Store</Link>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0D1120", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "var(--navy)", borderBottom: "1px solid #1E2535", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Link href="/dashboard" style={{ color: "var(--amber)", textDecoration: "none", fontSize: 14 }}>← My Library</Link>
        <span style={{ fontFamily: "var(--font-playfair)", color: "var(--ivory)", fontSize: 15, fontWeight: 600 }}>{book?.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {sessionMins > 0 && <span style={{ fontSize: 12, color: "#6B7280" }}>⏱ {sessionMins}m</span>}
          {pointsEarned > 0 && <span style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600 }}>+{pointsEarned}pts</span>}
          <Link href={`/api/download/${id}`} style={{ color: "#6B7280", textDecoration: "none", fontSize: 13 }}>Download ⬇️</Link>
        </div>
      </nav>
      <iframe src={url} style={{ flex: 1, width: "100%", border: "none", minHeight: "calc(100vh - 56px)" }} title={book?.title} />
    </main>
  );
}
