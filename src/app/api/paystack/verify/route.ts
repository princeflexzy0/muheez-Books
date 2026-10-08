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

  const { error } = await getSupabaseAdmin().from("purchases").upsert({
    user_id: userId,
    book_id: bookId,
    amount,
    paystack_ref: reference,
    status: "completed",
  }, { onConflict: "paystack_ref" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
