/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用所有可能导致路由混乱的重定向/重写
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;