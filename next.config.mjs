/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',   // ← Это главное исправление для ESM модулей
  },
  // Опционально: ускоряет сборку
  swcMinify: true,
};

export default nextConfig;
