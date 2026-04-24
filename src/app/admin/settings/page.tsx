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

// 新增：高度复用的版块设置卡片组件
const SectionConfigCard = ({ titleLabel, prefix, settings, setSettings }: any) => {
  const inputStyle = { width: "100%", padding: "10px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", color: "white", outline: "none" };
  return (
    <div style={{ background: "#0f172a", padding: "20px", borderRadius: "8px", border: "1px dashed #334155", marginBottom: "20px" }}>
      <h4 style={{ margin: "0 0 15px 0", color: "#3b82f6" }}>{titleLabel}</h4>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px", gap: "15px", alignItems: "center" }}>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: "5px" }}>图标(可留空)</label>
          <input style={inputStyle} value={settings[`${prefix}_icon`] || ""} onChange={e => setSettings({...settings, [`${prefix}_icon`]: e.target.value})} placeholder="如: 🛠️" />
        </div>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: "5px" }}>展示标题</label>
          <input style={inputStyle} value={settings[`${prefix}_title`] || ""} onChange={e => setSettings({...settings, [`${prefix}_title`]: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: "5px" }}>字体颜色</label>
          <input type="color" value={settings[`${prefix}_color`] || "#ffffff"} onChange={e => setSettings({...settings, [`${prefix}_color`]: e.target.value})} style={{ width: "100%", height: "38px", cursor: "pointer", background: "transparent", border: "none", padding: 0 }} />
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<any>({});

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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <FormGroup label="网站主标题"><input style={inputStyle} value={settings.site_title || ""} onChange={e => setSettings({...settings, site_title: e.target.value})} /></FormGroup>
          <FormGroup label="主标题颜色">
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
              <input type="color" value={settings.heading_color || "#ffffff"} onChange={e => setSettings({...settings, heading_color: e.target.value})} style={colorBlockStyle} />
              <span style={{ color: "#94a3b8" }}>{settings.heading_color || "#ffffff"}</span>
            </div>
          </FormGroup>
        </div>
        
        <FormGroup label="Logo 图片">
          <div style={{ display: "flex", gap: "15px", alignItems: "center", background: "#0f172a", padding: "15px", borderRadius: "8px", border: "1px dashed #334155" }}>
            {settings.logo_url ? <img src={settings.logo_url} alt="Logo" style={{ height: "40px", width: "auto", borderRadius: "4px" }} /> : <div style={{ color: "#64748b", fontStyle: "italic", fontSize: "0.9rem" }}>当前无 Logo</div>}
            <div style={{ flex: 1 }}></div>
            <ImageUpload onUploadSuccess={(url) => setSettings({...settings, logo_url: url})} label="更换 Logo" />
          </div>
        </FormGroup>
        
        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px", marginTop: "40px" }}>各版块视觉控制</h3>
        <SectionConfigCard titleLabel="第一栏: 产品与项目" prefix="products" settings={settings} setSettings={setSettings} />
        <SectionConfigCard titleLabel="第二栏: 开发手记" prefix="devnotes" settings={settings} setSettings={setSettings} />
        <SectionConfigCard titleLabel="第三栏: 外部博客" prefix="hashnode" settings={settings} setSettings={setSettings} />

        <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px", marginTop: "40px" }}>高级与数据源</h3>
        <FormGroup label="首页排版模式">
          <select style={selectStyle} value={settings.layout_mode || "classic"} onChange={e => setSettings({...settings, layout_mode: e.target.value})}>
            <option value="classic">Classic 经典网格</option>
            <option value="minimal">Minimal 极简列表</option>
          </select>
        </FormGroup>
        <FormGroup label="Hashnode 数据源"><input style={inputStyle} value={settings.hashnode_host || ""} onChange={e => setSettings({...settings, hashnode_host: e.target.value})} /></FormGroup>
        <FormGroup label="全局主题色(按钮/链接)"><input type="color" value={settings.primary_color || "#3b82f6"} onChange={e => setSettings({...settings, primary_color: e.target.value})} style={colorBlockStyle} /></FormGroup>
        
        <button onClick={handleSave} disabled={loading} style={{ width: "100%", padding: "16px", marginTop: "30px", backgroundColor: settings.primary_color || "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "同步中..." : "保存全部设置"}
        </button>
      </div>
    </div>
  );
}