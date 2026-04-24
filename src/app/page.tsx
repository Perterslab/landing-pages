import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// 抓取远程 Hashnode 博客
async function getHashnodePosts() {
  try {
    const res = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { publication(host: "xuepilot.hashnode.dev") { posts(first: 3) { edges { node { title, brief, url } } } } }`
      }),
      cache: 'no-store'
    });
    const json = await res.json();
    return json.data?.publication?.posts?.edges || [];
  } catch (e) { return []; }
}

export default async function HomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. 读取产品资产
  const { data: products } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
  
  // 2. 读取本地数据库的文章 (开发手记)
  const { data: localArticles } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });

  const hashnodePosts = await getHashnodePosts();

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Ray&apos;s Lab</div>
        {/* 修复 1：使用原生 a 标签代替 Link，并直接跳转 /login 触发系统鉴权 */}
        <a href="/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "bold" }}>Admin Portal &rarr;</a>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* 全英文：工具与产品区 */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>🛠️ Tools & Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
            {products?.map(p => (
              <a href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155", transition: "transform 0.2s" }}>
                  <img src={p.cover_image} alt="Cover" style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{p.name}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>{p.summary}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 新增独立版块：开发手记 (仅在有数据时显示) */}
        {localArticles && localArticles.length > 0 && (
          <section style={{ marginBottom: "60px" }}>
            <h2 style={{ marginBottom: "30px" }}>💻 Dev Notes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
              {localArticles.map((art) => (
                <div key={art.id} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155", position: "relative" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#e2e8f0" }}>{art.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>{art.summary}</p>
                  <div style={{ marginTop: "20px", color: "#64748b", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                    <span>By Peter</span>
                    <span>{new Date(art.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 独立版块：AI 教育实验室 (Hashnode) */}
        {hashnodePosts && hashnodePosts.length > 0 && (
          <section>
            <h2 style={{ marginBottom: "30px" }}>📝 AI Education Lab</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
              {hashnodePosts.map((post: any, i: number) => (
                <a href={post.node.url} key={i} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(30, 41, 59, 0.5)", padding: "24px", borderRadius: "12px", textDecoration: "none", color: "inherit", border: "1px dashed #334155" }}>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#e2e8f0" }}>{post.node.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>{post.node.brief}</p>
                  <div style={{ marginTop: "20px", color: "#64748b", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                    <span>via Hashnode</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}