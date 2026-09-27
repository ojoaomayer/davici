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

  // Headers de cache otimizados (apenas em produção, para não travar cache de chunks no dev)
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
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
    }

    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
