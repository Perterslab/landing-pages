"use client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [localArticles, setLocalArticles] = useState<any[]>([]);
  const [hashnodePosts, setHashnodePosts] = useState<any[]>([]); // 新增：Hashnode 数据状态

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. 获取 Supabase 本地数据
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: prodData } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (prodData) setProducts(prodData);

      const { data: artData } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (artData) setLocalArticles(artData);

      // 2. 重新加回：获取远程 Hashnode 博客数据
      try {
        const res = await fetch('https://gql.hashnode.com/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query { publication(host: "xuepilot.hashnode.dev") { posts(first: 3) { edges { node { title, brief, url } } } } }`
          })
        });
        const json = await res.json();
        if (json.data?.publication?.posts?.edges) {
          setHashnodePosts(json.data.publication.posts.edges);
        }
      } catch (e) {
        console.error("Hashnode 获取失败", e);
      }
    };
    
    fetchAllData();
  }, []);

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" }}>
      
      {/* 顶部导航 */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px" }}>RAY&apos;S LAB</div>
        <button 
          onClick={() => { window.location.href = '/login'; }} 
          style={{ background: "transparent", color: "#3b82f6", fontWeight: "bold", border: "1px solid rgba(59, 130, 246, 0.5)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", transition: "0.2s" }}
        >
          Admin Portal &rarr;
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* 版块 1：产品展示栏 */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: "#fff" }}>🛠️ Products & Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {products.map(p => (
              <a href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
                  <img src={p.cover_image || ""} alt="" style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ margin: "0 0 10px 0" }}>{p.name}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.5" }}>{p.summary}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 版块 2：本地开发手记 (Dev Notes) */}
        {localArticles.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#10b981", marginBottom: "30px" }}>💻 Dev Notes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {localArticles.map((art) => (
                <div key={art.id} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ color: "#fff", marginBottom: "12px", fontSize: "1.2rem" }}>{art.title}</h4>
                  <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>{art.summary}</p>
                  <div style={{ marginTop: "20px", color: "#475569", fontSize: "0.85rem", textAlign: "right" }}>
                    {new Date(art.created_at).toLocaleDateString('en-US')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 版块 3：外部 Hashnode 博客归队 */}
        {hashnodePosts.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.8rem", color: "#8b5cf6", marginBottom: "30px" }}>📝 AI Education Lab</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {hashnodePosts.map((post: any, i: number) => (
                <a href={post.node.url} key={i} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(30, 41, 59, 0.4)", padding: "24px", borderRadius: "12px", textDecoration: "none", color: "inherit", border: "1px dashed #334155", display: "block" }}>
                  <h4 style={{ color: "#fff", marginBottom: "12px", fontSize: "