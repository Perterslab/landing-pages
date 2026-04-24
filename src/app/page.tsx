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
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

      const { data: setRes } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      setSettings(setRes);

      const { data: prodData } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (prodData) setProducts(prodData);

      const { data: artData } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (artData) setLocalArticles(artData);

      if (setRes?.hashnode_host) {
        try {
          const res = await fetch('https://gql.hashnode.com/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `query { publication(host: "${setRes.hashnode_host}") { posts(first: 3) { edges { node { title, brief, url } } } } }` })
          });
          const json = await res.json();
          if (json.data?.publication?.posts?.edges) setHashnodePosts(json.data.publication.posts.edges);
        } catch (e) { console.error(e); }
      }
    };
    fetchAllData();
  }, []);

  if (!settings) return <div style={{ background: "#0f172a", minHeight: "100vh" }} />;

  const isMinimal = settings.layout_mode === 'minimal';
  const displayTitle = settings.hashnode_title || "📝 AI Education Lab";
  const hColor = settings.heading_color || "#ffffff"; // 获取动态标题颜色

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" }}>
      
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {settings.logo_url && <img src={settings.logo_url} alt="Logo" style={{ height: "32px", width: "auto", borderRadius: "4px" }} />}
          <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px", color: hColor }}>
            {settings.site_title}
          </div>
        </div>
        <button onClick={() => { window.location.href = '/login'; }} style={{ background: "transparent", color: settings.primary_color || "#3b82f6", fontWeight: "bold", border: `1px solid ${settings.primary_color}80`, padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
          Admin Portal &rarr;
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: hColor }}>🛠️ Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {products.map(p => (
              <a href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", display: isMinimal ? "flex" : "block", gap: "20px", transition: "transform 0.2s" }}>
                  <img src={p.cover_image || ""} style={{ width: isMinimal ? "200px" : "100%", height: "180px", objectFit: "cover" }} />
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: hColor }}>{p.name}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.5" }}>{p.summary}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {localArticles.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: hColor }}>💻 Dev Notes</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {localArticles.map((art) => (
                <div key={art.id} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "1.2rem", color: hColor }}>{art.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>{art.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hashnodePosts.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: hColor }}>{displayTitle}</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {hashnodePosts.map((post: any, i: number) => (
                <a href={post.node.url} key={i} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(30, 41, 59, 0.4)", padding: "24px", borderRadius: "12px", textDecoration: "none", color: "inherit", border: "1px dashed #334155", display: "block" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "1.1rem", color: hColor }}>{post.node.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>{post.node.brief}</p>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}