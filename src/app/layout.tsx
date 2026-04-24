"use client";
import { Authenticated } from "@refinedev/core";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 菜单配置字典
  const menus = [
    { name: "📦 产品与工具", path: "/admin/products" },
    { name: "📝 资讯与新闻", path: "/admin/articles" },
    { name: "⚙️ 首页与风格", path: "/admin/settings" }
  ];

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push("/login");
  };

  return (
    <Authenticated key="admin-auth" redirectOnFail="/login">
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
        
        {/* 全局左侧主菜单 */}
        <aside style={{ width: "240px", backgroundColor: "#1e293b", borderRight: "1px solid #334155", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", left: 0, top: 0, zIndex: 50 }}>
          <div style={{ padding: "30px 24px" }}>
            <h2 style={{ color: "#ffffff", fontSize: "1.5rem", margin: 0, fontWeight: "900" }}>Ray&apos;s Lab</h2>
            <div style={{ color: "#3b82f6", fontSize: "0.85rem", marginTop: "5px", fontWeight: "bold" }}>中控实验室</div>
          </div>
          
          <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {menus.map(m => {
              const isActive = pathname.startsWith(m.path);
              return (
                <Link key={m.path} href={m.path} style={{ textDecoration: "none", color: isActive ? "#fff" : "#94a3b8", backgroundColor: isActive ? "#3b82f6" : "transparent", padding: "12px 16px", borderRadius: "8px", fontWeight: isActive ? "bold" : "normal", transition: "0.2s" }}>
                  {m.name}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: "20px" }}>
             <button onClick={handleLogout} style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
               退出登录
             </button>
          </div>
        </aside>

        {/* 右侧主内容区（让出左边 240px 的位置） */}
        <main style={{ marginLeft: "240px", flex: 1, width: "calc(100% - 240px)" }}>
          {children}
        </main>
      </div>
    </Authenticated>
  );
}