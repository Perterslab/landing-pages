"use client";
import React, { useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // 这里未来可以接入数据库，目前仅作 UI 搭建演示
    setTimeout(() => { alert("设置已保存！(当前为演示模式)"); setLoading(false); }, 800);
  };

  const FormGroup = ({ label, desc, children }: { label: string, desc?: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "24px", borderBottom: "1px solid #334155" }}>
      <div style={{ width: "35%" }}>
        <h4 style={{ margin: "0 0 8px 0", color: "#e2e8f0", fontSize: "1rem" }}>{label}</h4>
        {desc && <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", lineHeight: "1.5" }}>{desc}</p>}
      </div>
      <div style={{ width: "60%" }}>{children}</div>
    </div>
  );

  const inputStyle = { width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "8px", color: "white", outline: "none" };

  return (
    <div style={{ padding: "50px", color: "#f8fafc", maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>全局参数设置</h1>
          <p style={{ color: "#94a3b8", marginTop: "10px" }}>管理站点名称、SEO信息与基础展示风格</p>
        </div>
        <button onClick={handleSave} disabled={loading} style={{ padding: "12px 30px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "保存中..." : "保存设置"}
        </button>
      </div>

      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", border: "1px solid #334155" }}>
        <h3 style={{ borderBottom: "2px solid #3b82f6", paddingBottom: "10px", marginBottom: "30px", display: "inline-block" }}>站点基础信息</h3>
        
        <FormGroup label="独立站名称" desc="显示在浏览器标签页顶部和左上角Logo位置。">
          <input defaultValue="Ray's Lab" style={inputStyle} />
        </FormGroup>

        <FormGroup label="一句话 Slogan" desc="显示在首页大标题下方，用于传达你的核心价值观。">
          <input defaultValue="专注构建下一代 AI 工作流、高阶浏览器插件与全球化的全栈独立工具。" style={inputStyle} />
        </FormGroup>

        <FormGroup label="SEO 描述 (Description)" desc="用于谷歌等搜索引擎收录时展示的摘要文本。">
          <textarea defaultValue="个人数字产品矩阵管理后台，专注于技术创新与数字效率边界的探索。" style={{ ...inputStyle, height: "100px" }} />
        </FormGroup>

        <h3 style={{ borderBottom: "2px solid #3b82f6", paddingBottom: "10px", margin: "40px 0 30px", display: "inline-block" }}>外观与社交网络</h3>
        
        <FormGroup label="主题色 (Primary Color)" desc="按钮和关键链接的颜色。">
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#3b82f6", border: "2px solid white", cursor: "pointer" }}></div>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#10b981", cursor: "pointer" }}></div>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#8b5cf6", cursor: "pointer" }}></div>
          </div>
        </FormGroup>

        <FormGroup label="Twitter / X 链接" desc="在页面底部的社交图标跳转地址。">
          <input placeholder="https://twitter.com/..." style={inputStyle} />
        </FormGroup>
      </div>
    </div>
  );
}