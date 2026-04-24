import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// 强制每次访问首页时都拉取最新数据（确保后台发布后前台秒更新）
export const revalidate = 0;

export default async function HomePage() {
  // 连接数据库
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 抓取所有状态为“已发布”的数字资产，按时间倒序排列
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* 注入悬浮动画的 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          background-color: #1e293b;
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
          border: 1px solid #334155;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.5);
          border-color: #3b82f6;
        }
      `}} />

      {/* 极简导航栏 */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "24px 5%", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px" }}>
          <span style={{ color: "#3b82f6" }}>Ray&apos;s</span> Lab
        </div>
        <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500", transition: "color 0.2s" }}>
          进入中控台 &rarr;
        </Link>
      </nav>

      {/* 核心视觉区 (Hero Section) */}
      <header style={{ textAlign: "center", padding: "120px 20px 80px", background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "900", marginBottom: "24px", background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          探索数字效率的边界
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#94a3b8", maxWidth: "650px", margin: "0 auto", lineHeight: "1.8" }}>
          专注于构建下一代 AI 工作流、高阶浏览器插件与全球化的全栈独立工具。让技术回归创造力。
        </p>
      </header>

      {/* 数字资产陈列区 */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #1e293b", paddingBottom: "16px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>🔥 最新研发矩阵</h2>
        </div>

        {!products || products.length === 0 ? (
          // 空数据时的占位 UI
          <div style={{ textAlign: "center", padding: "80px", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px dashed #334155" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🧪</div>
            <p style={{ fontSize: "1.2rem", color: "#64748b" }}>核心实验室正在初始化，首款数字工具即将上线...</p>
          </div>
        ) : (
          // 动态渲染产品网格
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} style={{ textDecoration: "none" }}>
                <div className="product-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ backgroundColor: "#0f172a", color: "#60a5fa", padding: "6px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", border: "1px solid #1e293b" }}>
                      {product.product_type === 'project' ? '⚡ 旗舰架构' : '🛠️ 效率工具'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.5rem", color: "#f8fafc", marginBottom: "12px", fontWeight: "700" }}>{product.name}</h3>
                  <p style={{ color: "#94a3b8", lineHeight: "1.6", flexGrow: 1, marginBottom: "0" }}>{product.summary || "正在加载技术摘要..."}</p>
                  <div style={{ marginTop: "30px", color: "#3b82f6", fontWeight: "600", display: "flex", alignItems: "center", fontSize: "1.05rem" }}>
                    查阅技术白皮书 &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 页脚 */}
      <footer style={{ textAlign: "center", padding: "60px 20px 40px", color: "#475569", marginTop: "80px", borderTop: "1px solid #1e293b" }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()}Ray&apos;s Lab. All rights reserved.</p>
        <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>Powered by Next.js & Supabase</p>
      </footer>
    </main>
  );
}