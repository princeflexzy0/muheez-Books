import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "") || req.nextUrl.searchParams.get("token") || "";

  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabaseUser.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await getSupabaseAdmin().from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") {
    const { data: purchase } = await getSupabaseAdmin()
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .eq("status", "completed")
      .single();
    if (!purchase) return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  const { data: book } = await getSupabaseAdmin().from("books").select("file_url, title").eq("id", bookId).single();
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const { data, error } = await getSupabaseAdmin().storage.from("books").createSignedUrl(book.file_url, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
