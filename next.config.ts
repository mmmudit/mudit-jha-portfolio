import type { NextConfig } from "next";
import { execSync } from "child_process";
import path from "path";

function getDeploymentDate(): string {
  try {
    const gitDate = execSync("git log -1 --format=%aI", { encoding: "utf8" }).trim();
    if (gitDate) return gitDate;
  } catch {
    // Fallback if git command is not available in environment
  }
  return new Date().toISOString();
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "openlibrary.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "books.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.spotifycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pickasso.spotifycdn.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BUILD_DATE: getDeploymentDate(),
  },
  turbopack: {
    rules: {
      "*.html": {
        type: "raw",
      },
      "*:raw": {
        type: "raw",
      },
      "*": {
        condition: {
          any: [
            { path: "*.html" },
            { query: "?raw" },
            { query: /[?&]raw(?=&|$)/ }
          ]
        },
        type: "raw"
      }
    },
    resolveAlias: {
      "@designcodeio/threeui/style.css": "./src/shaders/threeui.css",
      "@designcodeio/threeui": "./src/shaders/index.ts",
      "./sources/epilude-footer.html?raw": "./src/shaders/neuform-isolated/sources/epilude-footer.ts",
      "./sources/epilude-footer.html": "./src/shaders/neuform-isolated/sources/epilude-footer.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@designcodeio/threeui/style.css": path.resolve(__dirname, "src/shaders/threeui.css"),
      "@designcodeio/threeui": path.resolve(__dirname, "src/shaders/index.ts"),
      "./sources/epilude-footer.html?raw": path.resolve(__dirname, "src/shaders/neuform-isolated/sources/epilude-footer.ts"),
      "./sources/epilude-footer.html": path.resolve(__dirname, "src/shaders/neuform-isolated/sources/epilude-footer.ts"),
    };
    config.module.rules.push({
      test: /\.html$/,
      type: "asset/source",
    });
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
