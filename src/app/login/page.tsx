"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("❌ 登录失败: " + error.message);
        setIsPending(false);
      } else if (data.session) {
        // 成功后直接硬跳转进后台，没有任何弹窗打断
        window.location.href = "/admin/products";
      }
    } catch (err: any) {
      alert("💥 系统报错: " + err.message);
      setIsPending(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Ray&apos;s Lab Login</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email Address" 
            style={{ padding: "14px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", outline: "none" }} 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            style={{ padding: "14px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", outline: "none" }} 
          />
          <button 
            type="submit" 
            disabled={isPending} 
            style={{ padding: "16px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: isPending ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
          >
            {isPending ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}