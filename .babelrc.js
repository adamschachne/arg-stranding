
const presets = [
  "react-app"
];
const plugins = [];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    "transform-remove-console",
    "transform-remove-debugger"
  );
} else {
  plugins.push("react-hot-loader/babel")
}

module.exports = { presets, plugins };