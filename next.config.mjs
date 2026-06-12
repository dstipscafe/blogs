/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/blogs',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
