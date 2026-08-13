/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "**.google.com" },
      { protocol: "https", hostname: "books.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.gstatic.com" },
      { protocol: "https", hostname: "www.gutenberg.org" },
      { protocol: "https", hostname: "gutenberg.org" },
      { protocol: "https", hostname: "www.gutenberg.net.au" },
      { protocol: "https", hostname: "archive.org" },
      { protocol: "https", hostname: "www.archive.org" },
      { protocol: "https", hostname: "**.archive.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "en.wikipedia.org" },
    ],
  },
};

export default nextConfig;
