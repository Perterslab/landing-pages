"use client";
import { Authenticated } from "@refinedev/core";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 默认展开包含当前路径的菜单栏
  const [openMenu, setOpenMenu] = useState<string | null>(
    pathname.includes("/articles") ? "articles" : pathname.includes("/settings") ? "settings" : "products"
  );

  const menus = [
    { 
      id: "products", icon: "📦", title: "产品与工具管理", 
      items: [ { name: "全部资产列表", path: "/admin/products" }, { name: "创建新产品", path: "/admin/products/create" } ] 
    },
    { 
      id: "articles", icon: "📝", title: "资讯与博客发布", 
      items: [ { name: "全部文章列表", path: "/admin/articles" }, { name: "撰写新文章", path: "/admin/articles/create" } ] 
    },
    { 
      id: "settings", icon: "⚙️", title: "系统与全局设置", 
      items: [ { name: "首页外观设置", path: "/admin/settings" } ] 
    }
  ];

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push("/login");
  };

  return (
    <Authenticated key="admin-auth" redirectOnFail="/login">
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
        
        {/* 左侧瀑布流菜单 */}
        <aside style={{ width: "260px", backgroundColor: "#1e293b", borderRight: "1px solid #334155", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", left: 0, top: 0, zIndex: 50, overflowY: "auto" }}>
          <div style={{ padding: "30px 24px", borderBottom: "1px solid #334155" }}>
            <h2 style={{ color: "#ffffff", fontSize: "1.5rem", margin: 0, fontWeight: "900" }}>Ray&apos;s Lab</h2>
            <div style={{ color: "#10b981", fontSize: "0.85rem", marginTop: "5px", fontWeight: "bold" }}>● 系统运行中</div>
          </div>
          
          <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {menus.map(menu => (
              <div key={menu.id} style={{ marginBottom: "5px" }}>
                <div onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)} style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: openMenu === menu.id ? "#fff" : "#94a3b8", borderRadius: "8px", transition: "0.2s", fontWeight: "bold", backgroundColor: openMenu === menu.id ? "rgba(255,255,255,0.05)" : "transparent" }}>
                  <span>{menu.icon} {menu.title}</span>
                  <span style={{ transform: openMenu === menu.id ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s", fontSize: "0.8rem" }}>▼</span>
                </div>
                
                {/* 子菜单折叠区 */}
                {openMenu === menu.id && (
                  <div style={{ display: "flex", flexDirection: "column", marginTop: "5px", marginLeft: "15px", borderLeft: "2px solid #334155", paddingLeft: "10px" }}>
                    {menu.items.map(item => {
                      const isActive = pathname === item.path;
                      return (
                        <Link key={item.path} href={item.path} style={{ textDecoration: "none", color: isActive ? "#3b82f6" : "#64748b", padding: "10px 12px", borderRadius: "6px", backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent", fontSize: "0.95rem", fontWeight: isActive ? "bold" : "normal" }}>
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
             <button onClick={handleLogout} style={{ width: "100%", padding: "12px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>退出登录</button>
          </div>
        </aside>

        <main style={{ marginLeft: "260px", flex: 1, width: "calc(100% - 260px)" }}>{children}</main>
      </div>
    </Authenticated>
  );
}