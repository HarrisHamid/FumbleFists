const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 16px rem so Tailwind sizes match the web prototype (NativeWind defaults to 14).
module.exports = withNativewind(config, { inlineRem: 16 });
