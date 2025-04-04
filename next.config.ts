import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
    // ... other config
    async headers() {
      return [
        {
          source: '/_next/static/chunks/webpack.js',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `script-src 'self' 'unsafe-eval' ${process.env.NEXT_PUBLIC_JITSI_DOMAIN}`
            }
          ]
        }
      ]
    }
  }
;

export default nextConfig;
