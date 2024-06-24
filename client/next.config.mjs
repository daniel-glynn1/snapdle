/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://snap-dle-api.onrender.com/api/:path*' // Adjust to your backend server URL
      }
    ];
  }
};

export default nextConfig;
