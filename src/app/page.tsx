"use client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [localArticles, setLocalArticles] = useState<any[]>([]);
  const [hashnodePosts, setHashnodePosts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

      // 获取设置
      const { data: setRes } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      setSettings(setRes);

      // 获取所有已发布的商品
      const { data: prodData } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (prodData) setProducts(prodData);

      // 获取开发手记
      const { data: artData } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (artData) setLocalArticles(artData);

      // 获取 Hashnode
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
  const siteHColor = settings.heading_color || "#ffffff"; 
  const pColor = settings.primary_color || "#3b82f6";

  // 严格区分分类
  const featuredProducts = products.filter(p => p.is_featured === true);
  const regularProducts = products.filter(p => p.is_featured !== true);

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {settings.logo_url && <img src={settings.logo_url} alt="Logo" style={{ height: "32px", width: "auto", borderRadius: "4px" }} />}
          <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px", color: siteHColor }}>{settings.site_title}</div>
        </div>
        <button onClick={() => { window.location.href = '/login'; }} style={{ background: "transparent", color: pColor, fontWeight: "bold", border: `1px solid ${pColor}80`, padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Admin Portal &rarr;</button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* 1. 主推项目展示 */}
        {featuredProducts.length > 0 && (
          <section style={{ marginBottom: "100px" }}>
            <h2 style={{ fontSize: "1.2rem", color: pColor, letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>Featured Projects</h2>
            {featuredProducts.map(p => (
              <div key={p.id} style={{ background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`, borderRadius: "24px", border: `1px solid ${pColor}40`, padding: "40px", display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "1fr 1fr", gap: "40px", alignItems: "center", marginBottom: "30px" }}>
                <img src={p.cover_image} style={{ width: "100%", borderRadius: "16px" }} />
                <div>
                  <h3 style={{ fontSize: "2rem", color: "#fff", margin: "0 0 15px 0" }}>{p.name}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "30px" }}>{p.summary}</p>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <a href={`/products/${p.slug}`} style={{ padding: "12px 24px", background: pColor, color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>Details</a>
                    {p.checkout_url && <a href={p.checkout_url} target="_blank" style={{ padding: "12px 24px", border: `1px solid ${pColor}`, color: pColor, textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>Buy Now</a>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 2. 普通商品列表 */}
        {regularProducts.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: settings.products_color || "#fff" }}>
              {settings.products_icon} {settings.products_title || "All Products"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {regularProducts.map(p => (
                <a href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", display: isMinimal ? "flex" : "block", gap: "20px" }}>
                    <img src={p.cover_image} style={{ width: isMinimal ? "200px" : "100%", height: "180px", objectFit: "cover" }} />
                    <div style={{ padding: "24px" }}><h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>{p.name}</h3><p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{p.summary}</p></div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 3. 开发手记 */}
        {localArticles.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: settings.devnotes_color || "#10b981" }}>
              {settings.devnotes_icon} {settings.devnotes_title || "Dev Notes"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {localArticles.map((art) => (
                <div key={art.id} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "1.2rem", color: "#fff" }}>{art.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{art.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Hashnode 博客 */}
        {hashnodePosts.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: settings.hashnode_color || "#8b5cf6" }}>
              {settings.hashnode_icon} {settings.hashnode_title || "Blog"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMinimal ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {hashnodePosts.map((post: any, i: number) => (
                <a href={post.node.url} key={i} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(30, 41, 59, 0.4)", padding: "24px", borderRadius: "12px", textDecoration: "none", color: "inherit", border: "1px dashed #334155", display: "block" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "1.1rem", color: "#fff" }}>{post.node.title}</h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{post.node.brief}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}