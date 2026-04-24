import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// 关键：强制每次访问都从数据库拉取最新数据，不缓存
export const revalidate = 0;

async function getHashnodePosts() {
  try {
    const res = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { publication(host: "xuepilot.hashnode.dev") { posts(first: 3) { edges { node { title, brief, url, coverImage { url } } } } } }`
      }),
      next: { revalidate: 3600 }
    });
    const json = await res.json();
    return json.data?.publication?.posts?.edges || [];
  } catch (e) { return []; }
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function HomePage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: products } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
  const blogPosts = await getHashnodePosts();

  const featured = products?.find(p => p.is_featured);
  const regular = products?.filter(p => p.id !== featured?.id) || [];

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Ray&apos;s Lab</div>
        <Link href="/admin/products" style={{ color: "#3b82f6", textDecoration: "none" }}>中控台 &rarr;</Link>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* 重磅推荐区 */}
        {featured && (
          <section style={{ marginBottom: "60px", backgroundColor: "#1e293b", borderRadius: "20px", overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 500px", minHeight: "350px", backgroundColor: "#000" }}>
              {getYouTubeId(featured.youtube_url) ? (
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeId(featured.youtube_url)}`} frameBorder="0" allowFullScreen></iframe>
              ) : (
                <img src={featured.cover_image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
            <div style={{ flex: "1 1 400px", padding: "40px" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>{featured.name}</h2>
              <p style={{ color: "#94a3b8", lineHeight: "1.6", marginBottom: "30px" }}>{featured.summary}</p>
              <Link href={`/products/${featured.slug}`} style={{ background: "#3b82f6", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>立即查看</Link>
            </div>
          </section>
        )}

        {/* 产品网格 */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ marginBottom: "30px" }}>🛠️ 全部工具资产</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
            {regular.map(p => (
              <Link href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
                  <img src={p.cover_image} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                  <div style={{ padding: "20px" }}>
                    <h3>{p.name}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{p.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 博客展示 */}
        <section>
          <h2 style={{ marginBottom: "30px" }}>📝 最新手记</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {blogPosts.map((post: any, i: number) => (
              <a href={post.node.url} key={i} target="_blank" style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", textDecoration: "none", color: "inherit", border: "1px solid #334155" }}>
                <h4 style={{ marginBottom: "10px" }}>{post.node.title}</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{post.node.brief}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}