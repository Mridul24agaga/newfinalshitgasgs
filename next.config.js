/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverActions: {
        allowedOrigins: ["localhost:3000"],
      },
    },
    env: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    },
  }
  
  module.exports = nextConfig
  
  