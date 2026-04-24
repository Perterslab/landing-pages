"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div style={{ marginBottom: "24px" }}><label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#94a3b8" }}>{label}</label>{children}</div>
);

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ title: "", summary: "", content: "", is_published: true });

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      const { data } = await supabaseBrowserClient.from("articles").select("*").eq("id", resolvedParams.id).single();
      if (data) { 
        setFormData(data);
        if (editorRef.current) editorRef.current.innerHTML = data.content || "";
      }
      setFetching(false);
    };
    loadData();
  }, [params]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    const htmlContent = editorRef.current?.innerHTML || "";
    const { error } = await supabaseBrowserClient.from("articles").update({ ...formData, content: htmlContent }).eq("id", id);
    if (!error) { router.push("/admin/articles"); } else { alert("修改失败：" + error.message); }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "14px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none" };
  const btnStyle = { padding: "8px 12px", background: "#334155", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px", fontSize: "0.9rem" };

  if (fetching) return <div style={{ padding: "50px", color: "#f8fafc" }}>⏳ 加载中...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", color: "#f8fafc" }}>
      <style>{`.editor:empty:before { content: attr(data-placeholder); color: #64748b; cursor: text; }`}</style>
      <aside style={{ width: "300px", borderRight: "1px solid #1e293b", padding: "40px 24px", flexShrink: 0 }}>
        <h2 style={{ color: "#10b981", marginBottom: "30px" }}>修改文章</h2>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} style={{ width: "18px", height: "18px" }}/> 立即公开
          </label>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ width: "100%", marginTop: "30px", padding: "16px", background: "#10b981", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
          {loading ? "更新中..." : "确认修改文章"}
        </button>
      </aside>

      <main style={{ flex: 1, padding: "60px" }}>
        <div style={{ maxWidth: "800px", background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
          <FormGroup label="标题"><input style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></FormGroup>
          <FormGroup label="摘要"><textarea style={{ ...inputStyle, height: "80px" }} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></FormGroup>
          <FormGroup label="正文">
            <div style={{ border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "10px", background: "#0f172a", borderBottom: "1px solid #334155" }}>
                <button onClick={() => handleFormat('bold')} style={btnStyle}><b>B</b></button>
                <button onClick={() => handleFormat('italic')} style={btnStyle}><i>I</i></button>
                <button onClick={() => handleFormat('formatBlock', 'H2')} style={btnStyle}>大标题</button>
              </div>
              <div ref={editorRef} contentEditable className="editor" data-placeholder="写点什么..." style={{ minHeight: "400px", padding: "20px", background: "#1e293b", outline: "none", lineHeight: "1.8" }} />
            </div>
          </FormGroup>
        </div>
      </main>
    </div>
  );
}