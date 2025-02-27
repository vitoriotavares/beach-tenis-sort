/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Estas variáveis serão sobrescritas pelas variáveis de ambiente da Vercel em produção
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
