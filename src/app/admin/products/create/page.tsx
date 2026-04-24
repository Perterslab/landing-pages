"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", slug: "", summary: "", description: "", 
    youtube_url: "", cover_image: "", download_url: "", 
    is_published: true, is_featured: false 
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabaseBrowserClient.storage.from('images').upload(filePath, file);
    if (uploadError) { alert("上传失败：" + uploadError.message); } 
    else {
      const { data } = supabaseBrowserClient.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, cover_image: data.publicUrl });
    }
    setUploadingImg(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { session } } = await supabaseBrowserClient.auth.getSession();
    if (!session) { alert("🚨 请刷新页面或重新登录！"); setLoading(false); return; }
    
    const { error } = await supabaseBrowserClient.from("products").insert([formData]);
    if (!error) { router.push("/admin/products"); } else { alert("保存失败：" + error.message); }
    setLoading(false);
  };

  const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: "24px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#94a3b8" }}>{label}</label>
      {children}
    </div>
  );
  const inputStyle = { width: "100%", padding: "14px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", color: "#f8fafc" }}>
      {/* 移除 fixed，采用普通 flex 排版 */}
      <aside style={{ width: "300px", borderRight: "1px solid #1e293b", padding: "40px 24px", flexShrink: 0 }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>创建新资产</h2>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px", cursor: "pointer" }}>
            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} style={{ width: "18px", height: "18px" }}/>
            立刻发布至首页
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} style={{ width: "18px", height: "18px" }}/>
            设为旗舰推荐 (置顶大图)
          </label>
        </div>
        <button onClick={handleSave} disabled={loading || uploadingImg} style={{ width: "100%", marginTop: "30px", padding: "16px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
          {loading ? "保存发布中..." : "确认保存并发布"}
        </button>
      </aside>

      <main style={{ flex: 1, padding: "60px" }}>
        <div style={{ maxWidth: "800px", background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px" }}>1. 基础信息</h3>
          <FormGroup label="产品名称 (必填)"><input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></FormGroup>
          <FormGroup label="访问路径 / Slug (必填，只能用英文和中划线)"><input style={inputStyle} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></FormGroup>
          <FormGroup label="一句话简介 (展示在首页卡片上)"><input style={inputStyle} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></FormGroup>
          
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", margin: "40px 0 25px" }}>2. 媒体与资源</h3>
          <FormGroup label="产品封面图 (支持直传或填入外部链接)">
            <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ padding: "10px", background: "#0f172a", border: "1px dashed #475569", borderRadius: "8px", width: "50%" }} />
              {uploadingImg && <span style={{ color: "#3b82f6", alignSelf: "center" }}>上传中...</span>}
            </div>
            <input placeholder="图片链接" style={inputStyle} value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} />
            {formData.cover_image && <img src={formData.cover_image} alt="预览" style={{ marginTop: "15px", height: "120px", borderRadius: "8px" }}/>}
          </FormGroup>
          <FormGroup label="YouTube 视频链接"><input style={inputStyle} value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} /></FormGroup>
          <FormGroup label="产品获取/下载链接"><input style={inputStyle} value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} /></FormGroup>
          
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", margin: "40px 0 25px" }}>3. 深度文案</h3>
          <FormGroup label="详细说明"><textarea style={{ ...inputStyle, height: "250px" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></FormGroup>
        </div>
      </main>
    </div>
  );
}