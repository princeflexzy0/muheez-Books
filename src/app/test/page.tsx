"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Test() {
  const [info, setInfo] = useState("loading...");

  useEffect(() => {
    async function check() {
      const { data: s } = await supabase.auth.getSession();
      const { data: u } = await supabase.auth.getUser();
      setInfo(JSON.stringify({ 
        session: s.session ? { email: s.session.user.email, expires: s.session.expires_at } : null,
        user: u.user ? { email: u.user.email } : null
      }, null, 2));
    }
    check();
  }, []);

  return (
    <main style={{ padding: 40, background: "#0A0E1A", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ color: "#F5A623", marginBottom: 20 }}>Auth Debug</h1>
      <pre style={{ background: "#1E2535", padding: 20, borderRadius: 8, fontSize: 13 }}>{info}</pre>
    </main>
  );
}
