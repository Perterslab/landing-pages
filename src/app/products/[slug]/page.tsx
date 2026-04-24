import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// --- 1. 内部组件定义区 (直接内置，不再报未定义错误) ---

const HeroSection = ({ name, summary }: { name: string; summary: string }) => (
  <section style={{ padding: "80px 20px", textAlign: "center", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
    <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1rem" }}>{name}</h1>
    <p style={{ fontSize: "1.25rem", color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>{summary}</p>
  </section>
);

const BlockEngine = ({ content }: { content: any }) => (
  <div style={{ padding: "60px 20px", maxWidth: "800px", margin: "0 auto" }}>
    <h2 style={{ fontSize: "2rem", marginBottom: "30px", borderBottom: "2px solid #3b82f6", display: "inline-block" }}>
      🧱 高级功能特性
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {content?.features?.map((feature: any, index: number) => (
        <div key={index} style={{ padding: "24px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1.25rem", color: "#1e293b", marginBottom: "10px" }}>✨ {feature.title}</h3>
          <p style={{ color: "#475569", lineHeight: "1.6" }}>{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const StandardContent = ({ description, url }: { description: string; url: string }) => (
  <div style={{ padding: "60px 20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
    <div style={{ fontSize: "1.1rem", color: "#334155", lineHeight: "1.8", marginBottom: "40px", textAlign: "left", whiteSpace: "pre-wrap" }}>
      {description}
    </div>
    {url && (
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer"
        style={{ display: "inline-block", padding: "16px 40px", backgroundColor: "#0f172a", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem", fontWeight: "500", transition: "all 0.2s" }}
      >
        立即访问 / 下载
      </a>
    )}
  </div>
);

// --- 2. Next.js 页面主逻辑 (服务端渲染 SSR) ---

export default async function ProductLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  // 解析 URL 参数
  const { slug } = await params;

  // 初始化 Supabase 客户端
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 获取数据库信息
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  // 如果找不到数据，抛出 404
  if (error || !product) {
    notFound();
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fcfcfc", fontFamily: "sans-serif" }}>
      {/* 渲染头部 */}
      <HeroSection name={product.name} summary={product.summary} />

      {/* 动态分发引擎 */}
      {product.product_type === "project" ? (
        <BlockEngine content={product.content} />
      ) : (
        <StandardContent description={product.description} url={product.download_url} />
      )}
      
      {/* 原生 HTML 小写 footer，彻底解决大写 Footer 找不到的问题 */}
      <footer style={{ textAlign: "center", padding: "40px", color: "#94a3b8", marginTop: "40px", borderTop: "1px solid #e2e8f0" }}>
        © {new Date().getFullYear()} Peter's Lab. All rights reserved.
      </footer>
    </main>
  );
}