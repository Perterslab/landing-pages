"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";
import ImageUpload from "@/components/ImageUpload";

const FormGroup = ({ label, children, desc }: { label: string, children: React.ReactNode, desc?: string }) => (
  <div style={{ marginBottom: "24px" }}>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#94a3b8" }}>{label}</label>
    {desc && <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "-4px", marginBottom: "8px" }}>{desc}</p>}
    {children}
  </div>
);

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ 
    name: "", slug: "", summary: "", description: "", cover_image: "", 
    external_url: "", checkout_url: "", is_published: true, is_featured: false 
  });

  const handleSave = async () => {
    if (!formData.name || !formData.slug) { alert("请填写名称和Slug"); return; }
    setLoading(true);
    const htmlContent = editorRef.current?.innerHTML || "";
    const { error } = await supabaseBrowserClient.from("products").insert([{ ...formData, description: htmlContent }]);
    if (!error) router.push("/admin/products");
    else alert(error.message);
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "14px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", color: "#f8fafc", backgroundColor: "#0f172a" }}>
      <aside style={{ width: "320px", borderRight: "1px solid #1e293b", padding: "40px 24px", flexShrink: 0 }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>上架新产品</h2>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
          <FormGroup label="封面图片"><ImageUpload onUploadSuccess={(url) => setFormData({...formData, cover_image: url})} label="上传封面" /></FormGroup>
        </div>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} /> 立即上架
          </label>
          {/* 新增主推勾选 */}
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#fbbf24" }}>
            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} /> ⭐️ 设为主推项目
          </label>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ width: "100%", marginTop: "30px", padding: "16px", background: "#10b981", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>保存并发布</button>
      </aside>
      <main style={{ flex: 1, padding: "40px 60px" }}>
        <div style={{ maxWidth: "800px", background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
          <FormGroup label="产品名称"><input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></FormGroup>
          <FormGroup label="Slug"><input style={inputStyle} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></FormGroup>
          <FormGroup label="购买链接"><input style={inputStyle} value={formData.checkout_url} onChange={e => setFormData({...formData, checkout_url: e.target.value})} /></FormGroup>
          <div ref={editorRef} contentEditable style={{ minHeight: "300px", padding: "20px", background: "#0f172a", borderRadius: "8px", border: "1px solid #334155", outline: "none" }} />
        </div>
      </main>
    </div>
  );
}