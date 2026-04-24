import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";

// 解析 YouTube 链接
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

// 核心修复：将 params 的类型声明为 Promise，兼容 Next.js 15
export default async function ProductLandingPage(props: { params: Promise<{ slug: string }> }) {
  // 等待 params 解析
  const params = await props.params;
  const slug = params.slug;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 根据网址的 slug 查找特定产品
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound(); 
  }

  const embedUrl = getYouTubeEmbedUrl(product.youtube_url);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#ffffff", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      
      <nav style={{ padding: "20px 5%", borderBottom: "1px solid #f1f5f9" }}>
        <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.95rem" }}>
          &larr; 返回 Ray&apos;s Lab
        </Link>
      </nav>

      <header style={{ padding: "80px 20px", textAlign: "center", backgroundColor: "#f8fafc" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "20px" }}>
          {product.name}
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#475569", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
          {product.summary}
        </p>
      </header>

      <section style={{ maxWidth: "900px", margin: "-40px auto 60px", padding: "0 20px" }}>
        <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", backgroundColor: "#000", aspectRatio: "16/9" }}>
          {embedUrl ? (
             <iframe width="100%" height="100%" src={embedUrl} title="Product Demo" frameBorder="0" allowFullScreen></iframe>
          ) : (
             <img src={product.cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'} alt={product.name || "产品封面"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      </section>

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{ padding: "40px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0", whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "1.1rem", color: "#334155" }}>
          {product.description || "详细功能白皮书正在撰写中..."}
        </div>
        
        {product.download_url && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <a href={product.download_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", backgroundColor: "#0f172a", color: "#ffffff", padding: "18px 40px", borderRadius: "12px", textDecoration: "none", fontSize: "1.2rem", fontWeight: "bold", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
              获取 {product.name} &rarr;
            </a>
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", padding: "40px", color: "#94a3b8", borderTop: "1px solid #f1f5f9" }}>
        © {new Date().getFullYear()} {product.name} by Ray&apos;s Lab.
      </footer>
    </main>
  );
}