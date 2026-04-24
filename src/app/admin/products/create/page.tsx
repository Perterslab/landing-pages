"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

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
    is_published: true, 
    is_featured: false 
  });

  const handleSave = async () => {
    setLoading(true);

    // 【核心安检】：在发货前，先摸一下口袋里有没有令牌
    const { data: { session } } = await supabaseBrowserClient.auth.getSession();
    if (!session) {
      alert("🚨 令牌丢失：系统认为你当前未登录！\n解决办法：请刷新页面，或者点击左侧退出重新登录一次。");
      setLoading(false);
      return;
    }

    // 带着令牌去发数据
    const { error } = await supabaseBrowserClient.from("products").insert([formData]);
    
    if (!error) { 
      // 成功后跳回产品列表
      router.push("/admin/products"); 
    } else { 
      alert("保存失败：" + error.message); 
    }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", marginBottom: "20px" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <aside style={{ width: "300px", borderRight: "1px solid #1e293b", padding: "40px 24px", position: "fixed", height: "100vh" }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>创建资产</h2>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>
            立刻发布 
            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
          </label>
          <label style={{ display: "block" }}>
            旗舰推荐 
            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
          </label>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ width: "100%", marginTop: "30px", padding: "15px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "保存中..." : "保存发布"}
        </button>
      </aside>

      <main style={{ marginLeft: "300px", flex: 1, padding: "60px" }}>
        <div style={{ maxWidth: "800px" }}>
          <h3>基本身份</h3>
          <input placeholder="产品名称 (例如：LexGuard AI)" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input placeholder="访问路径 Slug (例如：lexguard-ai)" style={inputStyle} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          <input placeholder="一句话简介" style={inputStyle} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
          
          <h3>展示资源</h3>
          <input placeholder="油管视频链接" style={inputStyle} value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} />
          <input placeholder="封面图链接" style={inputStyle} value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} />
          
          <h3>深度文案</h3>
          <textarea placeholder="详细说明" style={{ ...inputStyle, height: "200px" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
      </main>
    </div>
  );
}