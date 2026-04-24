"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // 诊断：检查 Supabase 配置是否丢失
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
      console.error("🚨 警告：环境变量 NEXT_PUBLIC_SUPABASE_URL 缺失！");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("❌ 登录失败详情: " + error.message);
      } else if (data.session) {
        alert("✅ 验证成功，正在跳转...");
        window.location.href = "/admin/products";
      } else {
        alert("🤔 验证完成，但没有拿到 Session，请检查数据库设置。");
      }
    } catch (err: any) {
      alert("💥 系统崩溃报错: " + err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Ray&apos;s Lab Login</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: "14px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff" }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ padding: "14px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff" }} />
          <button type="submit" disabled={isPending} style={{ padding: "16px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            {isPending ? "Connecting..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}