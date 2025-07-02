/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // swcMinify: false, // Disable SWC minification
  // experimental: {
  //   forceSwcTransforms: false, // Disable forced SWC transforms
  // },
};

export default nextConfig;
