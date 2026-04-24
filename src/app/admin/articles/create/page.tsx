"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";
import ImageUpload from "@/components/ImageUpload"; // 引入上传组件

const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div style={{ marginBottom: "24px" }}><label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#94a3b8" }}>{label}</label>{children}</div>
);

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ title: "", summary: "", content: "", cover_image: "", is_published: true });

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // 接收物理上传成功的 URL，并插入编辑器
  const insertUploadedImage = (url: string) => {
    document.execCommand("insertImage", false, url);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    setLoading(true);
    const htmlContent = editorRef.current?.innerHTML || "";
    const { error } = await supabaseBrowserClient.from("articles").insert([{ ...formData, content: htmlContent }]);
    if (!error) { router.push("/admin/articles"); } 
    else { alert("发布失败：" + error.message); }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "14px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none" };
  const btnStyle = { padding: "8px 12px", background: "#334155", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px", fontSize: "0.9rem" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", color: "#f8fafc" }}>
      <style>{`.editor:empty:before { content: attr(data-placeholder); color: #64748b; cursor: text; } .editor img { max-width: 100%; border-radius: 8px; margin: 10px 0; }`}</style>

      <aside style={{ width: "300px", borderRight: "1px solid #1e293b", padding: "40px 24px", flexShrink: 0 }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>撰写新文章</h2>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} style={{ width: "18px", height: "18px" }}/> 立即公开发布
          </label>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ width: "100%", marginTop: "30px", padding: "16px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "提交中..." : "保存并发布"}
        </button>
      </aside>

      <main style={{ flex: 1, padding: "60px" }}>
        <div style={{ maxWidth: "800px", background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
          <FormGroup label="文章标题"><input placeholder="输入标题..." style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></FormGroup>
          <FormGroup label="文章摘要 (选填)"><textarea placeholder="简短总结核心内容..." style={{ ...inputStyle, height: "80px" }} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></FormGroup>
          
          <FormGroup label="正文内容 (支持图文混排)">
            <div style={{ border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "10px", background: "#0f172a", borderBottom: "1px solid #334155", display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => handleFormat('bold')} style={btnStyle}><b>B</b></button>
                <button onClick={() => handleFormat('italic')} style={btnStyle}><i>I</i></button>
                <button onClick={() => handleFormat('formatBlock', 'H2')} style={btnStyle}>大标题</button>
                <button onClick={() => handleFormat('formatBlock', 'H3')} style={btnStyle}>小标题</button>
                <button onClick={() => handleFormat('insertUnorderedList')} style={btnStyle}>• 列表</button>
                {/* 整合的物理上传组件 */}
                <ImageUpload onUploadSuccess={insertUploadedImage} label="本地上传" />
              </div>
              <div ref={editorRef} contentEditable className="editor" data-placeholder="在这里开始写下你的想法..." style={{ minHeight: "400px", padding: "20px", background: "#1e293b", outline: "none", lineHeight: "1.8", fontSize: "1.1rem" }} />
            </div>
          </FormGroup>
        </div>
      </main>
    </div>
  );
}