// src/app/products/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 基础组件：标准型工具的极简首屏
const StandardHero = ({ data }: { data: any }) => (
  <div className="p-10 text-center bg-gray-50 border-b">
    <h1 className="text-4xl font-bold">{data.name}</h1>
    <p className="text-xl mt-4 text-gray-600">{data.tagline}</p>
    <a href={data.download_link} className="mt-8 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
      立即下载
    </a>
  </div>
);

// 基础组件：项目型软件的定制首屏
const ComplexHero = ({ data }: { data: any }) => (
  <div className="p-20 text-center bg-gray-900 text-white">
    <h1 className="text-5xl font-extrabold tracking-tight">{data.title}</h1>
  </div>
);

// 基础组件：功能矩阵模块
const FeatureGrid = ({ data }: { data: any }) => (
  <div className="max-w-5xl mx-auto p-10 grid grid-cols-2 gap-6">
    {data.items?.map((item: string, i: number) => (
      <div key={i} className="border p-6 rounded-lg shadow-sm bg-white text-lg font-medium text-gray-800">
        {item}
      </div>
    ))}
  </div>
);

// 组件映射字典：打通 JSON 到 UI 的关键
const BlockMapper: Record<string, React.FC<any>> = {
  hero: ComplexHero,
  feature_grid: FeatureGrid,
};

// 页面主渲染逻辑
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // 从数据库抓取对应 slug 的数据
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  // 如果数据库里没这个词条，或者发生错误，返回 404 页面
  if (error || !product) {
    notFound();
  }

  // 逻辑分支 A：渲染标准落地页 (LexGuard AI 类)
  if (product.product_type === 'standard') {
    return (
      <main className="min-h-screen bg-white">
        <StandardHero data={product} />
        <div className="max-w-3xl mx-auto p-10 text-gray-700 leading-relaxed">
          <p>{product.description || "暂无详细描述"}</p>
        </div>
      </main>
    );
  }

  // 逻辑分支 B：渲染项目型产品 (Creator Studio Pro 类)
  const blocks: any[] = typeof product.page_blocks === 'string' 
    ? JSON.parse(product.page_blocks) 
    : (product.page_blocks || []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 遍历 JSON 数组，动态渲染积木块 */}
      {blocks.map((block) => {
        const Component = BlockMapper[block.type];
        if (!Component) return null; // 找不到对应组件则跳过
        return <Component key={block.id} data={block.data} />;
      })}
    </main>
  );
}