// config-overrides.js
const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
  }),
  (config) => {
    // Configuration Jest personnalisée
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
