import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { reference, bookId, userId, amount } = await req.json();

  // Free book — skip Paystack verification
  if (!reference.startsWith("free_")) {
    const verify = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const result = await verify.json();
    if (!result.status || result.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }
  }

  // Check if purchase already exists
  const { data: existing } = await getSupabaseAdmin()
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .eq("status", "completed")
    .maybeSingle();

  if (existing) return NextResponse.json({ success: true });

  const { error } = await getSupabaseAdmin().from("purchases").insert({
    user_id: userId,
    book_id: bookId,
    amount,
    paystack_ref: reference,
    status: "completed",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send purchase confirmation email
  try {
    const { data: profile } = await getSupabaseAdmin().from("profiles").select("email, full_name").eq("id", userId).single();
    const { data: book } = await getSupabaseAdmin().from("books").select("title").eq("id", bookId).single();
    if (profile && book) {
      const { sendPurchaseEmail } = await import("@/lib/emails");
      await sendPurchaseEmail(profile.email, profile.full_name || "there", book.title, amount);
    }
  } catch (e) { console.error("Purchase email failed:", e); }

  return NextResponse.json({ success: true });
}
