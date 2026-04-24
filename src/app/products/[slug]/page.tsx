"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

export default function ProductLandingPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      
      const { data: pData } = await supabase.from("products").select("*").eq("slug", slug).single();
      setProduct(pData);

      const { data: sData } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      setSettings(sData);
    };
    if (slug) fetchData();
  }, [slug]);

  if (!product || !settings) return <div style={{ background: "#0f172a", minHeight: "100vh" }} />;

  const hColor = settings.heading_color || "#ffffff";
  const pColor = settings.primary_color || "#3b82f6";

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <a href="/" style={{ color: pColor, textDecoration: "none", fontWeight: "bold" }}>&larr; Back to Home</a>
        
        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <img src={product.cover_image} style={{ width: "100%", borderRadius: "16px", border: "1px solid #334155" }} />
          <div>
            <h1 style={{ fontSize: "2.5rem", margin: "0 0 20px 0", color: hColor }}>{product.name}</h1>
            <p style={{ color: "#94a3b8", fontSize: "1.2rem", lineHeight: "1.6" }}>{product.summary}</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
              {/* 优先显示直接结账/购买按钮 (高转化率路径) */}
              {product.checkout_url && (
                <a href={product.checkout_url} target="_blank" rel="noopener noreferrer" style={{ padding: "16px 32px", backgroundColor: "#10b981", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", textAlign: "center", boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)" }}>
                  🛒 Buy Now / Checkout
                </a>
              )}

              {/* 其次显示官网落地页按钮 */}
              {product.external_url && (
                <a href={product.external_url} target="_blank" rel="noopener noreferrer" style={{ padding: "16px 32px", backgroundColor: "transparent", border: `2px solid ${pColor}`, color: pColor, textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", textAlign: "center" }}>
                  Visit Official Website &rarr;
                </a>
              )}

              {!product.checkout_url && !product.external_url && (
                <div style={{ padding: "20px", background: "#1e293b", borderRadius: "8px", border: "1px dashed #475569", color: "#94a3b8", textAlign: "center" }}>
                  This tool is currently in development.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: "60px", borderTop: "1px solid #334155", paddingTop: "40px" }}>
          <h2 style={{ color: hColor, marginBottom: "20px" }}>Detailed Description</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} style={{ lineHeight: "1.8", color: "#cbd5e1" }} />
        </div>
      </div>
    </main>
  );
}