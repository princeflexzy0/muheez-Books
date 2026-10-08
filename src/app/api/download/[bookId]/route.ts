import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, rgb, degrees } from "pdf-lib";

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

  const { data: profile } = await getSupabaseAdmin().from("profiles").select("role, full_name").eq("id", user.id).single();

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

  const { data: signedData, error } = await getSupabaseAdmin().storage.from("books").createSignedUrl(book.file_url, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch the PDF
  const pdfRes = await fetch(signedData.signedUrl);
  const pdfBytes = await pdfRes.arrayBuffer();

  // Load and watermark
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const buyerName = profile?.full_name || user.email || "Licensed Copy";

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Diagonal watermark
    page.drawText("MuheezTalks", {
      x: width / 2 - 80,
      y: height / 2,
      size: 48,
      color: rgb(0.85, 0.65, 0.13),
      opacity: 0.08,
      rotate: degrees(45),
    });

    // Bottom footer
    page.drawText(`Licensed to: ${buyerName} | muheeztalks.com`, {
      x: 30,
      y: 20,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.6,
    });
  }

  const watermarkedBytes = await pdfDoc.save();
  const filename = book.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return new NextResponse(watermarkedBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}_muheeztalks.pdf"`,
    },
  });
}
