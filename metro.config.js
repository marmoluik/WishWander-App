const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Start with Expo's default Metro configuration
const config = getDefaultConfig(__dirname);

// Ensure common asset extensions remain while adding custom ones
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "ttf",
  "png",
  "jpg",
];

// Add SVG support without dropping default source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);

// Use the SVG transformer alongside the defaults
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

module.exports = withNativeWind(config, { input: "./global.css" });