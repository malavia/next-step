// config-overrides.js

const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),

  (config) => {
    // Ajout des extensions .tsx, .ts pour la résolution de Webpack
    config.resolve.extensions = [...config.resolve.extensions, '.js', '.jsx', '.ts', '.tsx'];

    if (config.jest) {
      config.jest.moduleNameMapper = {
        ...config.jest.moduleNameMapper,
        '^@components/(.*)$': '<rootDir>/src/components/$1',
      };

      config.jest.collectCoverageFrom = [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts",
        "!src/serviceWorker.js",
      ];
    }

    return config;
  }
);
