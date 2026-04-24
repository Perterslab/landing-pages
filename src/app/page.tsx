import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const { data: products } = await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
  const { data: localArticles } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
  const hashnodePosts = await getHashnodePosts();

  return (
    <main style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh" }}>
      {/* 🔴 诊断标签：如果看不到这个，说明 Vercel 没读这个文件 */}
      <div style={{ backgroundColor: "red", color: "white", padding: "5px", textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>
        DIAGNOSTIC MODE: VERSION 2.0 (2026-04-25) - IF YOU SEE THIS, DEPLOY IS SUCCESSFUL
      </div>

      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 5%", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "900" }}>RAY&apos;S LAB</div>
        <button 
          onClick={() => { window.location.assign('/login'); }} 
          style={{ background: "transparent", color: "#3b82f6", fontWeight: "bold", border: "1px solid rgba(59, 130, 246, 0.5)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" }}
        >
          Admin Portal &rarr;
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "30px" }}>🛠️ Products & Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {products?.map(p => (
              <a href={`/products/${p.slug}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
                  <img src={p.cover_image || ""} alt="" style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                  <div style={{ padding: "24px" }}>
                    <h3>{p.name}</h3>
                    <p style={{ color: "#94a3b8" }}>{p.summary}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {localArticles && localArticles.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#10b981", marginBottom: "30px" }}>💻 Dev Notes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {localArticles.map((art) => (
                <div key={art.id} style={{ background: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ color: "#fff", marginBottom: "12px" }}>{art.title}</h4>
                  <p style={{ color: "#94a3b8" }}>{art.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}