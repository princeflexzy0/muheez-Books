import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emails";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  try {
    await sendWelcomeEmail(email, name);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
