import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// 强制每次访问都获取最新数据
export const revalidate = 0;

// 1. Hashnode 博客抓取函数
async function getHashnodePosts() {
  try {
    const response = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            publication(host: "xuepilot.hashnode.dev") {
              posts(first: 3) {
                edges {
                  node { title, brief, url, coverImage { url } }
                }
              }
            }
          }
        `,
      }),
      // 缓存 1 小时，避免频繁调用 API
      next: { revalidate: 3600 } 
    });
    const json = await response.json();
    return json.data?.publication?.posts?.edges || [];
  } catch (error) {
    console.error("获取博客失败:", error);
    return [];
  }
}

// 2. 油管链接转换函数 (将普通观看链接转为内嵌 iframe 链接)
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default async function HomePage() {
  // 连接数据库 (使用你之前焊死的常量或系统环境变量)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 抓取所有已发布产品
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // 抓取博客文章
  const blogPosts = await getHashnodePosts();

  // 数据分类：分离出“重磅推荐”和“常规展示”
  const featuredProducts = products?.filter(p => p.is_featured) || [];
  const regularProducts = products?.filter(p => !p.is_featured) || [];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* 全局动效样式 */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-card { transition: all 0.3s ease; border: 1px solid #334155; }
        .hover-card:hover { transform: translateY(-6px); box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.2); border-color: #3b82f6; }
        .blog-card:hover h3 { color: #60a5fa; }
      `}} />

      {/* 导航栏 */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "24px 5%", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px" }}>
          <span style={{ color: "#3b82f6" }}>Ray&apos;s</span> Lab
        </div>
        <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.95rem", fontWeight: "600" }}>
          中控台 &rarr;
        </Link>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* === 模块 1：重磅推荐区 (Featured) === */}
        {featuredProducts.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", borderBottom: "2px solid #1e293b", paddingBottom: "10px", marginBottom: "30px" }}>
              🌟 核心旗舰架构
            </h2>
            {featuredProducts.map((product) => {
              const embedUrl = getYouTubeEmbedUrl(product.youtube_url);
              return (
                <div key={product.id} className="hover-card" style={{ display: "flex", flexWrap: "wrap", backgroundColor: "#1e293b", borderRadius: "20px", overflow: "hidden", marginBottom: "30px" }}>
                  {/* 左侧：视频或封面图 */}
                  <div style={{ flex: "1 1 500px", minHeight: "350px", backgroundColor: "#000" }}>
                    {embedUrl ? (
                      <iframe width="100%" height="100%" src={embedUrl} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ minHeight: "350px" }}></iframe>
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundImage: `url(${product.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                    )}
                  </div>
                  {/* 右侧：产品信息 */}
                  <div style={{ flex: "1 1 400px", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "16px", color: "#f8fafc" }}>{product.name}</h3>
                    <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: "1.7", marginBottom: "30px" }}>{product.summary}</p>
                    <Link href={`/products/${product.slug}`} style={{ display: "inline-block", backgroundColor: "#3b82f6", color: "#fff", padding: "14px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", textAlign: "center", width: "fit-content" }}>
                      查阅白皮书 & 获取
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* === 模块 2：全矩阵产品墙 === */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", borderBottom: "2px solid #1e293b", paddingBottom: "10px", marginBottom: "30px" }}>
            🛠️ 数字资产库
          </h2>
          {regularProducts.length === 0 ? (
             <p style={{ color: "#64748b" }}>更多数字工具正在研发中...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {regularProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} style={{ textDecoration: "none" }}>
                  <div className="hover-card" style={{ backgroundColor: "#1e293b", borderRadius: "16px", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                    {/* 缩略图 */}
                    <div style={{ height: "180px", backgroundImage: `url(${product.cover_image || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80'})`, backgroundSize: "cover", backgroundPosition: "center", borderBottom: "1px solid #334155" }}></div>
                    {/* 内容 */}
                    <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <h3 style={{ fontSize: "1.4rem", color: "#f8fafc", marginBottom: "10px", fontWeight: "700" }}>{product.name}</h3>
                      <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "0.95rem", flexGrow: 1 }}>{product.summary}</p>
                      <div style={{ marginTop: "20px", color: "#60a5fa", fontWeight: "600", fontSize: "0.95rem" }}>查看详情 &rarr;</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* === 模块 3：Hashnode 技术专栏 === */}
        <section>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", borderBottom: "2px solid #1e293b", paddingBottom: "10px", marginBottom: "30px" }}>
            📝 极客手记 (来自 Hashnode)
          </h2>
          {blogPosts.length === 0 ? (
            <p style={{ color: "#64748b" }}>暂无最新博文。</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
              {blogPosts.map((post: any, index: number) => (
                <a href={post.node.url} target="_blank" rel="noopener noreferrer" key={index} className="hover-card blog-card" style={{ textDecoration: "none", backgroundColor: "#0f172a", borderRadius: "16px", padding: "24px", display: "block" }}>
                  <h3 style={{ fontSize: "1.25rem", color: "#f8fafc", marginBottom: "12px", transition: "color 0.2s" }}>{post.node.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.node.brief}
                  </p>
                </a>
              ))}
            </div>
          )}
        </section>

      </div>

      <footer style={{ textAlign: "center", padding: "40px", color: "#475569", borderTop: "1px solid #1e293b" }}>
        © {new Date().getFullYear()} Ray&apos;s Lab. Building digital independence.
      </footer>
    </main>
  );
}