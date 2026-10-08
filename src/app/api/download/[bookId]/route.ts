import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const authHeader = req.headers.get("cookie") || "";

  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { cookie: authHeader } } }
  );

  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") {
    const { data: purchase } = await supabaseAdmin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .eq("status", "completed")
      .single();
    if (!purchase) return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  const { data: book } = await supabaseAdmin.from("books").select("file_url, title").eq("id", bookId).single();
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const { data, error } = await supabaseAdmin.storage.from("books").createSignedUrl(book.file_url, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
