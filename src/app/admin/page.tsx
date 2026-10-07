"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", read_online: false, downloadable: true });
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      await new Promise(r => setTimeout(r, 500)); const { data: { session } } = await supabase.auth.getSession(); const user = session?.user;
      if (!user) { router.push("/auth/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (prof?.role !== "admin") { router.push("/dashboard"); return; }
      const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
      setBooks(data || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setMessage("Please select a book file"); return; }
    setUploading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("books").upload(`files/${fileName}`, file);
    if (uploadError) { setMessage(uploadError.message); setUploading(false); return; }

    let cover_url = "";
    if (cover) {
      const coverExt = cover.name.split(".").pop();
      const coverName = `${Date.now()}-cover.${coverExt}`;
      const { error: coverError } = await supabase.storage.from("books").upload(`covers/${coverName}`, cover);
      if (!coverError) {
        const { data } = supabase.storage.from("books").getPublicUrl(`covers/${coverName}`);
        cover_url = data.publicUrl;
      }
    }

    const { error: dbError } = await supabase.from("books").insert({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      file_url: `files/${fileName}`,
      cover_url,
      read_online: form.read_online,
      downloadable: form.downloadable,
    });

    if (dbError) { setMessage(dbError.message); } 
    else {
      setMessage("Book uploaded successfully! ✅");
      setForm({ title: "", description: "", price: "", read_online: false, downloadable: true });
      setFile(null);
      setCover(null);
      const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
      setBooks(data || []);
    }
    setUploading(false);
  }

  async function handleDelete(id: string, file_url: string) {
    await supabase.storage.from("books").remove([file_url]);
    await supabase.from("books").delete().eq("id", id);
    setBooks(books.filter(b => b.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--amber)" }}>Loading...</div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--navy)" }}>
      <nav style={{ background: "#0D1120", borderBottom: "1px solid #1E2535", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>MuheezTalks Admin</span>
        <Link href="/analytics" style={{ color: "#6B7280", fontSize: 13, textDecoration: "none", marginRight: 16 }}>Analytics</Link><Link href="/settings" style={{ color: "#6B7280", fontSize: 13, textDecoration: "none", marginRight: 16 }}>Settings</Link><button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #374151", color: "var(--ivory)", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          Logout
        </button>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        {/* UPLOAD FORM */}
        <div style={{ background: "var(--slate)", borderRadius: 16, padding: 36, border: "1px solid #2D3748", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--ivory)", marginBottom: 28 }}>Upload New Book</h2>
          {message && (
            <div style={{ background: message.includes("✅") ? "#0D2D1A" : "#2D1515", border: `1px solid ${message.includes("✅") ? "#166534" : "#7F1D1D"}`, color: message.includes("✅") ? "#86EFAC" : "#FCA5A5", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              {message}
            </div>
          )}
          <form onSubmit={handleUpload}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Book Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                  style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 14, outline: "none" }}
                  placeholder="The AI Income Blueprint" />
              </div>
              <div>
                <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Price (USD) *</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
                  style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 14, outline: "none" }}
                  placeholder="3.00" />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 14, outline: "none", resize: "vertical" }}
                placeholder="What will readers learn from this book?" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Book File (PDF) *</label>
                <input type="file" accept=".pdf,.epub" onChange={e => setFile(e.target.files?.[0] || null)} required
                  style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 14, outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#D1D5DB", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Cover Image</label>
                <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] || null)}
                  style={{ width: "100%", background: "#0A0E1A", border: "1px solid #374151", borderRadius: 8, padding: "12px 16px", color: "var(--ivory)", fontSize: 14, outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#D1D5DB", fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={form.read_online} onChange={e => setForm({ ...form, read_online: e.target.checked })} />
                Allow Read Online
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#D1D5DB", fontSize: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={form.downloadable} onChange={e => setForm({ ...form, downloadable: e.target.checked })} />
                Allow Download
              </label>
            </div>
            <button type="submit" disabled={uploading}
              style={{ background: "var(--amber)", color: "#000", padding: "13px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
              {uploading ? "Uploading..." : "Upload Book"}
            </button>
          </form>
        </div>

        {/* BOOKS LIST */}
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "var(--ivory)", marginBottom: 24 }}>All Books ({books.length})</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {books.map((book) => (
            <div key={book.id} style={{ background: "var(--slate)", borderRadius: 12, padding: 24, border: "1px solid #2D3748", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700, color: "var(--ivory)", marginBottom: 4 }}>{book.title}</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "var(--amber)", fontWeight: 700 }}>${book.price}</span>
                  {book.read_online && <span style={{ color: "#86EFAC", fontSize: 12 }}>Read Online</span>}
                  {book.downloadable && <span style={{ color: "#93C5FD", fontSize: 12 }}>Downloadable</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(book.id, book.file_url)}
                style={{ background: "#2D1515", border: "1px solid #7F1D1D", color: "#FCA5A5", padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
