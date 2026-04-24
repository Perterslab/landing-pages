"use client";
import React, { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";
import ImageUpload from "@/components/ImageUpload";

const FormGroup = ({ label, children, desc }: { label: string, children: React.ReactNode, desc?: string }) => (
  <div style={{ marginBottom: "24px" }}>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#e2e8f0" }}>{label}</label>
    {desc && <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "-4px", marginBottom: "8px" }}>{desc}</p>}
    {children}
  </div>
);

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState({
    site_title: "", site_subtitle: "", primary_color: "", heading_color: "#ffffff", contact_email: "",
    logo_url: "", hashnode_host: "xuepilot.hashnode.dev", 
    hashnode_title: "📝 AI Education Lab", layout_mode: "classic"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabaseBrowserClient.from("site_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
      setFetching(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabaseBrowserClient.from("site_settings").update({
      ...settings, updated_at: new Date().toISOString()
    }).eq("id", 1);
    
    if (error) alert("保存失败: " + error.message);
    else alert("✅ 设置已成功更新！");
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none", fontSize: "1rem" };
  const selectStyle = { ...inputStyle, cursor: "pointer", appearance: "auto" };
  const colorBlockStyle = { width: "50px", height: "40px", cursor: "pointer", background: "transparent", border: "none", padding: 0 };

  if (fetching) return <div style={{ padding: "40px", color: "#94a3b8" }}>读取配置中...</div>;

  return (
    <div style={{ padding: "40px", color: "#f8fafc", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>系统与外观设置</h1>
      
      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
        
        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px" }}>核心参数</h3>
        <FormGroup label="网站主标题"><input style={inputStyle} value={settings.site_title || ""} onChange={e => setSettings({...settings, site_title: e.target.value})} /></FormGroup>
        
        <FormGroup label="Logo 图片">
          <div style={{ display: "flex", gap: "15px", alignItems: "center", background: "#0f172a", padding: "15px", borderRadius: "8px", border: "1px dashed #334155" }}>
            {settings.logo_url ? <img src={settings.logo_url} alt="Logo" style={{ height: "40px", width: "auto", borderRadius: "4px" }} /> : <div style={{ color: "#64748b", fontStyle: "italic", fontSize: "0.9rem" }}>当前无 Logo</div>}
            <div style={{ flex: 1 }}></div>
            <ImageUpload onUploadSuccess={(url) => setSettings({...settings, logo_url: url})} label="更换 Logo" />
          </div>
        </FormGroup>
        
        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px", marginTop: "40px" }}>前台展示规则</h3>
        <FormGroup label="首页排版模式">
          <select style={selectStyle} value={settings.layout_mode || "classic"} onChange={e => setSettings({...settings, layout_mode: e.target.value})}>
            <option value="classic">Classic 经典网格 (推荐)</option>
            <option value="minimal">Minimal 极简列表</option>
          </select>
        </FormGroup>
        
        <div style={{ background: "#0f172a", padding: "20px", borderRadius: "8px", border: "1px solid #334155", marginBottom: "24px" }}>
          <FormGroup label="Hashnode 版块名称"><input style={inputStyle} value={settings.hashnode_title || ""} onChange={e => setSettings({...settings, hashnode_title: e.target.value})} /></FormGroup>
          <FormGroup label="Hashnode 数据源"><input style={inputStyle} value={settings.hashnode_host || ""} onChange={e => setSettings({...settings, hashnode_host: e.target.value})} /></FormGroup>
        </div>

        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px", marginTop: "40px" }}>色彩与联络</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <FormGroup label="主题强调色 (主色)">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="color" value={settings.primary_color || "#3b82f6"} onChange={e => setSettings({...settings, primary_color: e.target.value})} style={colorBlockStyle} />
              <span style={{ color: "#94a3b8" }}>{settings.primary_color || "#3b82f6"}</span>
            </div>
          </FormGroup>
          <FormGroup label="各级标题颜色">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="color" value={settings.heading_color || "#ffffff"} onChange={e => setSettings({...settings, heading_color: e.target.value})} style={colorBlockStyle} />
              <span style={{ color: "#94a3b8" }}>{settings.heading_color || "#ffffff"}</span>
            </div>
          </FormGroup>
        </div>
        
        <FormGroup label="官方联系邮箱"><input type="email" style={inputStyle} value={settings.contact_email || ""} onChange={e => setSettings({...settings, contact_email: e.target.value})} /></FormGroup>

        <button onClick={handleSave} disabled={loading} style={{ width: "100%", padding: "16px", marginTop: "30px", backgroundColor: settings.primary_color || "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "同步中..." : "保存全部设置"}
        </button>
      </div>
    </div>
  );
}