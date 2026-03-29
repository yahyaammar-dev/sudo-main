// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

// Add Buffer polyfill for React Native
config.resolver.alias = {
  ...config.resolver.alias,
  buffer: require.resolve('buffer'),
};

// Add Tamagui resolver configuration
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure proper resolution of Tamagui packages
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add node_modules resolution
config.resolver.nodeModulesPaths = [
  path.resolve(process.cwd(), 'node_modules'),
];

module.exports = config;
