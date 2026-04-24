"use client";
import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";
import ImageUpload from "@/components/ImageUpload";

// 表单组通用组件
const FormGroup = ({ label, children, desc }: { label: string, children: React.ReactNode, desc?: string }) => (
  <div style={{ marginBottom: "24px" }}>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#94a3b8" }}>{label}</label>
    {desc && <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "-4px", marginBottom: "8px" }}>{desc}</p>}
    {children}
  </div>
);

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Next.js 15 推荐使用 use() 来解构 Promise 类型的 params
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    slug: "", 
    summary: "", 
    description: "", 
    cover_image: "", 
    external_url: "", 
    checkout_url: "", 
    is_published: false,
    is_featured: false // 主推标记
  });

  // 页面加载时读取数据库现有数据
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabaseBrowserClient
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
        
      if (data) {
        setFormData(data);
        if (editorRef.current) {
          editorRef.current.innerHTML = data.description || "";
        }
      }
      setFetching(false);
    };
    fetchProduct();
  }, [productId]);

  // 富文本格式化命令
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // 接收物理上传成功的图片 URL 并插入编辑器
  const insertUploadedImage = (url: string) => {
    document.execCommand("insertImage", false, url);
    editorRef.current?.focus();
  };

  // 保存更新
  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      alert("请填写商品名称和路由别名(Slug)！");
      return;
    }

    setLoading(true);
    const htmlContent = editorRef.current?.innerHTML || "";
    
    const { error } = await supabaseBrowserClient
      .from("products")
      .update({ 
        ...formData, 
        description: htmlContent 
      })
      .eq("id", productId);
    
    if (!error) {
      router.push("/admin/products");
    } else {
      alert("更新失败：" + error.message);
    }
    setLoading(false);
  };

  const inputStyle = { 
    width: "100%", 
    padding: "14px", 
    backgroundColor: "#0f172a", 
    border: "1px solid #334155", 
    borderRadius: "8px", 
    color: "white", 
    outline: "none" 
  };
  
  const btnStyle = { 
    padding: "8px 12px", 
    background: "#334155", 
    color: "white", 
    border: "none", 
    borderRadius: "4px", 
    cursor: "pointer", 
    marginRight: "8px", 
    fontSize: "0.9rem" 
  };

  if (fetching) return (
    <div style={{ padding: "40px", color: "#94a3b8", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      Connecting to Laboratory Database...
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", color: "#f8fafc", backgroundColor: "#0f172a" }}>
      <style>{`
        .editor:empty:before { content: attr(data-placeholder); color: #64748b; cursor: text; } 
        .editor img { max-width: 100%; border-radius: 8px; margin: 10px 0; border: 1px solid #334155; }
      `}</style>

      {/* 左侧控制栏 */}
      <aside style={{ width: "320px", borderRight: "1px solid #1e293b", padding: "40px 24px", flexShrink: 0 }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>Edit Product</h2>
        
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
          <FormGroup label="封面图片">
            {formData.cover_image && (
              <img 
                src={formData.cover_image} 
                alt="Cover" 
                style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }} 
              />
            )}
            <ImageUpload onUploadSuccess={(url) => setFormData({...formData, cover_image: url})} label="更换封面" />
          </FormGroup>
        </div>

        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={formData.is_published} 
              onChange={e => setFormData({...formData, is_published: e.target.checked})} 
              style={{ width: "18px", height: "18px" }}
            /> 
            立即上架展示
          </label>
          
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#fbbf24" }}>
            <input 
              type="checkbox" 
              checked={formData.is_featured} 
              onChange={e => setFormData({...formData, is_featured: e.target.checked})} 
              style={{ width: "18px", height: "18px" }}
            /> 
            ⭐️ 设为主推项目
          </label>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={loading} 
          style={{ 
            width: "100%", marginTop: "30px", padding: "16px", 
            background: "#3b82f6", border: "none", borderRadius: "8px", 
            color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" 
          }}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </aside>

      {/* 右侧编辑主区 */}
      <main style={{ flex: 1, padding: "40px 60px", overflowY: "auto" }}>
        <div style={{ maxWidth: "800px", background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <FormGroup label="产品名称">
              <input 
                placeholder="如: LexGuard AI" 
                style={inputStyle} 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </FormGroup>
            <FormGroup label="URL 别名 (Slug)">
              <input 
                placeholder="lexguard-ai" 
                style={inputStyle} 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
              />
            </FormGroup>
          </div>
          
          <FormGroup label="简短描述 (Summary)">
            <textarea 
              placeholder="一句话说明产品的核心价值..." 
              style={{ ...inputStyle, height: "80px", resize: "none" }} 
              value={formData.summary} 
              onChange={e => setFormData({...formData, summary: e.target.value})} 
            />
          </FormGroup>

          {/* 转化与外链设置 */}
          <div style={{ padding: "20px", background: "#0f172a", borderRadius: "8px", border: "1px solid #334155", marginBottom: "24px" }}>
            <h3 style={{ marginTop: 0, color: "#8b5cf6", fontSize: "1.1rem", marginBottom: "15px" }}>🔗 Conversion & Links</h3>
            <FormGroup label="直接购买/结账链接 (如 Gumroad)" desc="设置后，前台将显示绿色的高亮购买按钮">
              <input 
                placeholder="https://gumroad.com/l/..." 
                style={inputStyle} 
                value={formData.checkout_url || ""} 
                onChange={e => setFormData({...formData, checkout_url: e.target.value})} 
              />
            </FormGroup>
            <FormGroup label="外部详情页链接 (选填)" desc="如果该产品有独立的落地页或官网">
              <input 
                placeholder="https://..." 
                style={inputStyle} 
                value={formData.external_url || ""} 
                onChange={e => setFormData({...formData, external_url: e.target.value})} 
              />
            </FormGroup>
          </div>
          
          <FormGroup label="图文详情 (Description)">
            <div style={{ border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "10px", background: "#0f172a", borderBottom: "1px solid #334155", display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => handleFormat('bold')} style={btnStyle}><b>B</b></button>
                <button onClick={() => handleFormat('italic')} style={btnStyle}><i>I</i></button>
                <button onClick={() => handleFormat('formatBlock', 'H2')} style={btnStyle}>H2</button>
                <button onClick={() => handleFormat('formatBlock', 'H3')} style={btnStyle}>H3</button>
                <button onClick={() => handleFormat('insertUnorderedList')} style={btnStyle}>• List</button>
                <ImageUpload onUploadSuccess={insertUploadedImage} label="插入图片" />
              </div>
              <div 
                ref={editorRef} 
                contentEditable 
                className="editor" 
                data-placeholder="详细介绍你的产品特性、功能和定价..." 
                style={{ minHeight: "300px", padding: "20px", background: "#1e293b", outline: "none", lineHeight: "1.8", fontSize: "1rem" }} 
              />
            </div>
          </FormGroup>
        </div>
      </main>
    </div>
  );
}