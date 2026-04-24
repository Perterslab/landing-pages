"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 焊死连接（确保此处与你的 constants.ts 一致）
const supabaseUrl = "https://jdnuikgtxooetvoyyyvw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbnVpa2d0eG9vZXR2b3l5eXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTUzNDQsImV4cCI6MjA5MjQ5MTM0NH0.QcBdJ4IVSaQQJn1y7s8RSRiR0yqcdtfFp2F1IZSNE2E";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    summary: "",
    description: "",
    youtube_url: "",
    cover_image: "",
    download_url: "",
    is_published: false,
    is_featured: false,
    product_type: "tool"
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("products").insert([formData]);
      if (error) throw error;
      alert("🎉 成功点亮新产品！");
      router.push("/admin/products");
    } catch (err: any) {
      alert("保存失败: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      {/* --- 左侧：快捷控制面板 --- */}
      <aside style={{ width: "300px", borderRight: "1px solid #1e293b", padding: "40px 24px", position: "fixed", height: "100vh", display: "flex", flexDirection: "column", gap: "30px" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#3b82f6" }}>控制中心</h2>
        
        <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px", cursor: "pointer" }}>
            <span>立即发布上线</span>
            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} style={{ width: "20px", height: "20px" }} />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span>设为首页旗舰推荐</span>
            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} style={{ width: "20px", height: "20px" }} />
          </label>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button 
            onClick={handleSave} 
            disabled={loading}
            style={{ width: "100%", padding: "14px", backgroundColor: "#3b82f6", color: "white", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.3)" }}
          >
            {loading ? "正在同步云端..." : "确认并保存发布"}
          </button>
        </div>
      </aside>

      {/* --- 右侧：主编辑区 --- */}
      <main style={{ marginLeft: "300px", flex: 1, padding: "40px 60px" }}>
        <div style={{ maxWidth: "800px" }}>
          <header style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "900" }}>创建新产品</h1>
            <p style={{ color: "#94a3b8" }}>配置 Ray&apos;s Lab 的下一个数字资产</p>
          </header>

          {/* 模块 A：基础身份信息 */}
          <section style={{ backgroundColor: "#1e293b", padding: "32px", borderRadius: "16px", border: "1px solid #334155", marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "1.1rem", borderLeft: "4px solid #3b82f6", paddingLeft: "12px" }}>基础信息</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>