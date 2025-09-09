// Learn more https://docs.expo.dev/guides/monorepos/#metro-config
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

/** @type {import('metro-config').ConfigT} */
const config = getDefaultConfig(projectRoot);

// Add resolver alias for '@' → project root, matching tsconfig.json
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = config.resolver.extraNodeModules || {};
config.resolver.extraNodeModules['@'] = path.resolve(projectRoot, '.');

module.exports = config;



