"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useLogin } from "@refinedev/core";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 【核心修复】：将 isLoading 替换为新版本支持的 isPending
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("请输入邮箱和密码！");
      return;
    }
    login({ email, password });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px solid #334155", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.2rem", margin: "0 0 10px 0", color: "#fff", fontWeight: "900" }}>Ray&apos;s Lab</h1>
          <div style={{ display: "inline-block", padding: "4px 12px", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>
            中控实验室安全入口
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8", fontSize: "0.95rem", fontWeight: "bold" }}>管理员邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "1rem" }}
              placeholder="admin@rayslifelab.com"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8", fontSize: "0.95rem", fontWeight: "bold" }}>访问密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "1rem" }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{ 
              width: "100%", padding: "16px", marginTop: "15px", 
              backgroundColor: isPending ? "#475569" : "#3b82f6", 
              color: "#fff", border: "none", borderRadius: "8px", 
              cursor: isPending ? "not-allowed" : "pointer", 
              fontWeight: "bold", fontSize: "1.1rem", transition: "0.2s" 
            }}
          >
            {isPending ? "正在验证密钥..." : "安全登录"}
          </button>
        </form>

      </div>
    </div>
  );
}