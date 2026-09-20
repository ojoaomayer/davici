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

  // Headers de cache agressivo para assets estáticos (fontes, imagens, JS/CSS)
  async headers() {
    return [
      {
        source: '/(.*\\.(?:js|css|woff2|woff|ttf|ico|png|jpg|jpeg|gif|svg|webp|avif))',
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
