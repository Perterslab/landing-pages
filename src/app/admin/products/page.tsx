"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function ProductsList() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabaseBrowserClient.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "50px", color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>数字资产库</h1>
          <p style={{ color: "#94a3b8", marginTop: "10px" }}>管理 Ray&apos;s Lab 的所有落地页与工具</p>
        </div>
        <button onClick={() => router.push("/admin/products/create")} style={{ padding: "12px 24px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
          + 点亮新产品
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8" }}>读取中...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {products.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b", padding: "20px 24px", borderRadius: "12px", border: "1px solid #334155" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: p.is_published ? "#10b981" : "#64748b" }}></span>
                  {p.name}
                  {p.is_featured && <span style={{ fontSize: "0.8rem", padding: "2px 8px", backgroundColor: "#d97706", borderRadius: "4px", color: "white" }}>推荐</span>}
                </h3>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>/{p.slug}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => window.open(`/products/${p.slug}`, '_blank')} style={{ padding: "10px 20px", backgroundColor: "transparent", color: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>预览落地页</button>
                
                {/* 核心修复：点击编辑跳转到对应的 ID */}
                <button onClick={() => router.push(`/admin/products/edit/${p.id}`)} style={{ padding: "10px 20px", backgroundColor: "#475569", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>编辑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}