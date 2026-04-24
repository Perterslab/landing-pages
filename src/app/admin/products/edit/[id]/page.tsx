"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

// 兼容 Next.js 15，params 必须声明为 Promise
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({ 
    name: "", slug: "", summary: "", description: "", 
    youtube_url: "", cover_image: "", download_url: "", 
    is_published: false, is_featured: false 
  });

  // 1. 初始化时读取数据库中的原有数据
  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      const { data, error } = await supabaseBrowserClient
        .from("products")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (data) {
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          summary: data.summary || "",
          description: data.description || "",
          youtube_url: data.youtube_url || "",
          cover_image: data.cover_image || "",
          download_url: data.download_url || "",
          is_published: data.is_published || false,
          is_featured: data.is_featured || false
        });
      } else if (error) {
        alert("加载数据失败：" + error.message);
      }
      setFetching(false);
    };
    loadData();
  }, [params]);

  // 2. 独立图片上传逻辑 (和创建页保持一致)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImg(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabaseBrowserClient.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      alert("上传图片失败：" + uploadError.message);
    } else {
      const { data } = supabaseBrowserClient.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, cover_image: data.publicUrl });
    }
    setUploadingImg(false);
  };

  // 3. 提交更新到数据库
  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    const { data: { session } } = await supabaseBrowserClient.auth.getSession();
    if (!session) {
      alert("🚨 令牌丢失，请刷新或重新登录！");
      setLoading(false); return;
    }
    
    // 这里使用 update 而不是 insert，并指定被修改的 id
    const { error } = await supabaseBrowserClient
      .from("products")
      .update(formData)
      .eq("id", id);
      
    if (!error) { 
      router.push("/admin/products"); 
    } else { 
      alert("更新失败：" + error.message); 
    }
    setLoading(false);
  };

  const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: "24px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#94a3b8", fontSize: "0.95rem" }}>
        {label}
      </label>
      {children}
    </div>
  );

  const inputStyle = { width: "100%", padding: "14px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none" };

  if (fetching) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "50px", fontSize: "1.2rem" }}>⏳ 正在努力加载资产数据...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <aside style={{ width: "300px", borderRight: "1px solid #1e293b", padding: "40px 24px", position: "fixed", height: "100vh" }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>编辑资产</h2>
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
        <button onClick={handleSave} disabled={loading || uploadingImg} style={{ width: "100%", marginTop: "30px", padding: "16px", background: "#10b981", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem", opacity: (loading || uploadingImg) ? 0.7 : 1 }}>
          {loading ? "保存中..." : "确认修改"}
        </button>
      </aside>

      <main style={{ marginLeft: "300px", flex: 1, padding: "60px" }}>
        <div style={{ maxWidth: "800px", background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px", color: "#e2e8f0" }}>1. 基础信息</h3>
          <FormGroup label="产品名称 (必填)">
            <input placeholder="例如：LexGuard AI 智能合规系统" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </FormGroup>
          <FormGroup label="访问路径 / Slug (必填，只能用英文和中划线)">
            <input placeholder="例如：lexguard-ai" style={inputStyle} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          </FormGroup>
          <FormGroup label="一句话简介 (展示在首页卡片上)">
            <input placeholder="简要描述这个工具的核心价值..." style={inputStyle} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
          </FormGroup>
          
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", margin: "40px 0 25px", color: "#e2e8f0" }}>2. 媒体与资源</h3>
          <FormGroup label="产品封面图 (支持直传或填入外部链接)">
            <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ padding: "10px", background: "#0f172a", border: "1px dashed #475569", borderRadius: "8px", color: "#94a3b8", width: "50%" }} />
              {uploadingImg && <span style={{ color: "#3b82f6", alignSelf: "center" }}>正在上传至 Supabase...</span>}
            </div>
            <input placeholder="或者直接粘贴网络图片链接..." style={inputStyle} value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} />
            {formData.cover_image && <img src={formData.cover_image} alt="预览" style={{ marginTop: "15px", height: "120px", borderRadius: "8px", border: "1px solid #334155" }}/>}
          </FormGroup>
          <FormGroup label="YouTube 视频链接 (如果有，将在详情页播放)">
            <input placeholder="例如：https://www.youtube.com/watch?v=..." style={inputStyle} value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} />
          </FormGroup>
          <FormGroup label="产品获取/下载链接 (目标跳转地址)">
            <input placeholder="例如 Chrome 商店链接或外部网站..." style={inputStyle} value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />
          </FormGroup>
          
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "15px", margin: "40px 0 25px", color: "#e2e8f0" }}>3. 深度文案</h3>
          <FormGroup label="详细说明 (支持换行，展示在详情页)">
            <textarea placeholder="在这里输入产品的详细功能、更新日志或使用说明..." style={{ ...inputStyle, height: "250px", resize: "vertical" }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </FormGroup>
        </div>
      </main>
    </div>
  );
}