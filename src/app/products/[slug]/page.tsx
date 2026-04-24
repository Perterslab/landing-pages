"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

export default function ProductLandingPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
      setProduct(data);
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (!product) return <div style={{ background: "#0f172a", minHeight: "100vh" }} />;

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/" style={{ color: "#3b82f6", textDecoration: "none" }}>&larr; Back to Home</a>
        
        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <img src={product.cover_image} style={{ width: "100%", borderRadius: "16px", border: "1px solid #334155" }} />
          <div>
            <h1 style={{ fontSize: "2.5rem", margin: "0 0 20px 0" }}>{product.name}</h1>
            <p style={{ color: "#94a3b8", fontSize: "1.2rem", lineHeight: "1.6" }}>{product.summary}</p>
            
            {/* 核心：如果设置了外部链接，显示主按钮 */}
            {product.external_url ? (
              <a href={product.external_url} target="_blank" style={{ display: "inline-block", marginTop: "30px", padding: "16px 32px", backgroundColor: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem" }}>
                Visit Official Website / Landing Page &rarr;
              </a>
            ) : (
              <div style={{ marginTop: "30px", padding: "20px", background: "#1e293b", borderRadius: "8px", border: "1px dashed #475569" }}>
                This tool is currently in development.
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginTop: "60px", borderTop: "1px solid #334155", paddingTop: "40px" }}>
          <h2>Detailed Description</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} style={{ lineHeight: "1.8", color: "#cbd5e1" }} />
        </div>
      </div>
    </main>
  );
}