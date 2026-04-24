"use client";
import React, { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";

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
    site_title: "",
    site_subtitle: "",
    primary_color: "",
    contact_email: ""
  });

  // 读取数据库里 ID 为 1 的唯一配置
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
      ...settings,
      updated_at: new Date().toISOString()
    }).eq("id", 1);
    
    if (error) alert("保存失败: " + error.message);
    else alert("✅ 设置已成功更新！");
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none", fontSize: "1rem" };

  if (fetching) return <div style={{ padding: "40px", color: "#94a3b8" }}>读取配置中...</div>;

  return (
    <div style={{ padding: "40px", color: "#f8fafc", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>全局外观与参数设置</h1>
      <p style={{ color: "#94a3b8", marginBottom: "40px" }}>管理你独立站的品牌形象、颜色风格和核心信息。</p>

      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px" }}>品牌标识</h3>
        
        <FormGroup label="网站主标题 (Site Title)" desc="显示在左上角导航栏和浏览器标签页上的文字">
          <input style={inputStyle} value={settings.site_title} onChange={e => setSettings({...settings, site_title: e.target.value})} placeholder="例如: RAY'S LAB" />
        </FormGroup>

        <FormGroup label="网站副标题 / Slogan" desc="用于 SEO 优化或首页的欢迎语介绍">
          <input style={inputStyle} value={settings.site_subtitle} onChange={e => setSettings({...settings, site_subtitle: e.target.value})} placeholder="例如: Digital Asset Management" />
        </FormGroup>

        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px", marginTop: "40px" }}>视觉与联系方式</h3>

        <FormGroup label="主题强调色 (Primary Color)" desc="按钮、高亮文字和特定图标的主色调 (Hex 格式)">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="color" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} style={{ width: "50px", height: "50px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0, background: "transparent" }} />
            <input style={{ ...inputStyle, width: "150px" }} value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} />
          </div>
        </FormGroup>

        <FormGroup label="官方联系邮箱">
          <input type="email" style={inputStyle} value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
        </FormGroup>

        <button 
          onClick={handleSave} 
          disabled={loading} 
          style={{ width: "100%", padding: "16px", marginTop: "30px", backgroundColor: settings.primary_color || "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
        >
          {loading ? "正在同步到服务器..." : "保存全部设置"}
        </button>
      </div>
    </div>
  );
}