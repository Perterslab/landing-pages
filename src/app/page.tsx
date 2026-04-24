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
  const siteHColor = settings.heading_color || "#ffffff"; 
  const pColor = settings.primary_color || "#3b82f6";

  // 区分主推产品和普通产品
  const featuredProducts = products.filter(p => p.is_featured);
  const regularProducts = products.filter(p => !p.is_featured);

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
        
        {/* 🚀 主推项目区 (Hero Section) */}
        {featuredProducts.length > 0 && (
          <section style={{ marginBottom: "100px" }}>
            <h2 style={{ fontSize: "1.2rem", color: pColor, letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}>Featured Projects</h2>
            {featuredProducts.map(p => (
              <div key={p.id} style={{ background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`, borderRadius: "24px", border: `1px solid ${pColor}40`, padding: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center", marginBottom: "30px", boxShadow: `0 20px 50px ${pColor}10` }}>
                <img src={p.cover_image} style={{ width: "100%", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
                <div>
                  <h3 style={{ fontSize: "2.5rem", color: "#fff", margin: "0 0 15px 0" }}>{p.name}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "30px" }}>{p.summary}</p>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <a href={`/products/${p.slug}`} style={{ padding: "14px 28px", background: pColor, color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>View Details</a>
                    {p.checkout_url && <a href={p.checkout_url} style={{ padding: "14px 28px", border: `1px solid ${pColor}`, color: pColor, textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>Buy Now</a>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 普通项目网格 */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: settings.products_color }}>{settings.products_icon} {settings.products_title}</h2>
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

        {/* 开发手记与博客... (保持不变) */}
      </div>
    </main>
  );
}