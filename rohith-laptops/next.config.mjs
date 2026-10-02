/** @type {import('next').NextConfig} */
const nextConfig = {
  // Builds a fully static website into the "out" folder,
  // so it can be uploaded to any hosting (Vercel, Netlify, cPanel, Hostinger...).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
