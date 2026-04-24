import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// 强制不缓存，每次进入后台都拉取最新数据
export const revalidate = 0;

export default async function AdminProductsListPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 获取所有产品（无论是否发布）
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div style={{ color: "red", padding: "40px" }}>数据库读取失败: {error.message}</div>;
  }

  return (
    <div style={{ padding: "40px 60px", backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      
      {/* 顶部控制栏 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "8px" }}>数字资产库</h1>
          <p style={{ color: "#94a3b8" }}>管理 Ray&apos;s Lab 的所有落地页与工具</p>
        </div>
        <Link 
          href="/admin/products/create" 
          style={{ padding: "12px 24px", backgroundColor: "#3b82f6", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.3)" }}
        >
          + 点亮新产品
        </Link>
      </div>

      {/* 资产列表网格 */}
      {products?.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px dashed #334155" }}>
          <p style={{ color: "#64748b", fontSize: "1.2rem" }}>空空如也，赶紧去创建第一个旗舰产品吧！</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {products?.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* 状态指示灯 */}
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: p.is_published ? "#10b981" : "#64748b", boxShadow: p.is_published ? "0 0 10px #10b981" : "none" }} title={p.is_published ? "已上线" : "草稿"}></div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "4px" }}>
                    {p.name} 
                    {p.is_featured && <span style={{ marginLeft: "10px", fontSize: "0.8rem", padding: "2px 8px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", borderRadius: "4px", border: "1px solid #f59e0b" }}>推荐</span>}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>/{p.slug}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link href={`/products/${p.slug}`} target="_blank" style={{ padding: "8px 16px", backgroundColor: "transparent", color: "#60a5fa", border: "1px solid #3b82f6", borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem" }}>
                  预览落地页
                </Link>
                {/* 这里的编辑功能我们可以后续再做，先留个入口 */}
                <button style={{ padding: "8px 16px", backgroundColor: "#334155", color: "white", border: "none", borderRadius: "6px", cursor: "not-allowed", fontSize: "0.9rem" }}>
                  编辑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}