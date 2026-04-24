"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@utils/supabase/client";

export default function ArticlesList() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabaseBrowserClient.from("articles").select("*").order("created_at", { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div style={{ padding: "50px", color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>资讯与手记</h1>
          <p style={{ color: "#94a3b8", marginTop: "10px" }}>发布你的最新动态、教程或深度文章</p>
        </div>
        <button onClick={() => router.push("/admin/articles/create")} style={{ padding: "12px 24px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
          + 撰写新文章
        </button>
      </div>

      {loading ? (<div style={{ color: "#94a3b8" }}>读取中...</div>) : articles.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px dashed #475569", color: "#64748b" }}>还没有发布任何文章，点击右侧按钮开始撰写吧。</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {articles.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b", padding: "20px 24px", borderRadius: "12px", border: "1px solid #334155" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: a.is_published ? "#10b981" : "#64748b" }}></span>
                  {a.title}
                </h3>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}