import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Arquivos de dados locais necessários para o servidor
  outputFileTracingIncludes: {
    '/**': ['./data/**/*'],
  },

  // Performance: compressão Gzip/Brotli nas responses
  compress: true,

  // Segurança: não expõe stack tecnológico
  poweredByHeader: false,

  // Tree-shaking otimizado para pacotes grandes (reduz bundle JS)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Turbopack: sem configurações extras — usa .next/ local por padrão
  turbopack: {},

  // Headers de cache para assets de vídeo (mp4)
  // NOTA: Não configuramos cache para /_next/static em produção aqui para
  // evitar o aviso do Next.js. Em produção, CDNs como Vercel já gerenciam
  // o cache dos assets estáticos automaticamente.
  async headers() {
    return [
      {
        source: '/(.*\\.mp4)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
