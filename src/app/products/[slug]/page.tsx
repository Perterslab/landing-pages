export default async function ProductLandingPage({ params }) {
  const { slug } = params;
  
  // 1. 从数据库取数据 (SSR)
  const product = await getProductBySlug(slug);

  if (!product) return <div>404 - 资产未找到</div>;

  return (
    <main className="landing-page-container">
       {/* 统一的海报/标题头 */}
       <HeroSection name={product.name} summary={product.summary} />

       {/* 动态内容分发 */}
       {product.product_type === 'project' ? (
         <BlockEngine content={product.content} />
       ) : (
         <StandardContent description={product.description} url={product.download_url} />
       )}

       {/* 统一的页脚 */}
       <Footer />
    </main>
  );
}