"use client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [localArticles, setLocalArticles] = useState<any[]>([]);
  const [hashnodePosts, setHashnodePosts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. 获取网站全局设置
      const { data: setRes } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      setSettings(setRes);

      // 2. 获取产品
      const { data: prodData } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (prodData) setProducts(prodData);

      // 3. 获取开发手记
      const { data: artData } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (artData) setLocalArticles(artData);

      // 4. 获取 Hashnode
      if (setRes?.hashnode_host) {
        try {
          const res = await fetch('https://gql.hashnode.com/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `query { publication(host: "${setRes.hashnode_host}") { posts(first: 3) { edges { node { title, brief, url } } } } }`
            })
          });
          const json = await res.json();
          if (json.data?.publication?.posts?.edges) {
            setHashnodePosts(json.data.publication.posts.edges);
          }
        } catch (e) { console.error("Hashnode error", e); }
      }
    };
    fetchAllData();
  }, []);

  if (!settings) return <div style={{ background: "#0f172a", minHeight: "100vh" }} />;

  const isMinimal = settings.layout_mode === 'minimal';
  const displayTitle = settings.hashnode_title || "📝 AI Education Lab"; // 读取后台标题

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" }}>
      
      {/* 动态导航栏 */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {settings.logo_url && <img src={settings.logo_url} alt="Logo" style={{ height: "32px", width: "auto", borderRadius: "4px" }} />}
          <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px", color: settings.primary_color || "#fff" }}>
            {settings.site_title}
          </div>
        </div>
        <button onClick={() => { window.location.href = '/login'; }} style={{ background: "transparent", color: settings.primary_color || "#3b82f6", fontWeight: "bold", border: `1px solid ${settings.primary_color}80`, padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
          Admin Portal &rarr;
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* 产品版块 */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "30px" }}>🛠️ Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {products.map(p => (
              <a href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", display: isMinimal ? "flex" : "block", gap: "20px" }}>
                  <img src={p.cover_image || ""} style={{ width: isMinimal ? "200px" : "100%", height: "180px", objectFit: "cover" }} />
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ margin: "0 0 10px 0" }}>{p.name}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{p.summary}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 开发手记 (Dev Notes) */}
        {localArticles.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#10b981", marginBottom: "30px" }}>💻 Dev Notes</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {localArticles.map((art) => (
                <div key={art.id} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ color: "#fff", marginBottom: "12px", fontSize: "1.2rem" }}>{art.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{art.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 重新回归的 Hashnode 版块 */}
        {hashnodePosts.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.8rem", color: settings.primary_color || "#8b5cf6", marginBottom: "30px" }}>
              {displayTitle}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {hashnodePosts.map((post: any, i: number) => (
                <a 
                  href={post.node.url} 
                  key={i} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    background: "rgba(30, 41, 59, 0.4)", padding: "24px", 
                    borderRadius: "12px", textDecoration: "none", color: "inherit", 
                    border: "1px dashed #334155", display: "block" 
                  }}
                >
                  <h4 style={{ color: "#fff", marginBottom: "12px", fontSize: "1.1rem" }}>
                    {post.node.title}
                  </h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>
                    {post.node.brief}
                  </p>
                  <div style={{ 
                    marginTop: "20px", color: "#64748b", fontSize: "0.85rem", 
                    display: "flex", justifyContent: "space-between", 
                    borderTop: "1px dashed #334155", paddingTop: "15px" 
                  }}>
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