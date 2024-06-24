/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5050/api/:path*' // Adjust to your backend server URL
      }
    ];
  }
};

export default nextConfig;
