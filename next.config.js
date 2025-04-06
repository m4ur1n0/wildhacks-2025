/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use Babel for tests but avoid custom Babel for Next.js app files
  webpack: (config, { isServer }) => {
    // Apply Babel only for test files
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ]
        }
      }
    });

    return config;
  },
};

module.exports = nextConfig;
