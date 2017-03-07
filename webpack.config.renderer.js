const webpack = require("webpack");

const config = require("./webpack.config.base");
module.exports = Object.assign(config, {
  entry: {
    renderer: "./renderer/renderer.tsx"
  },
  target: "electron-renderer",
  plugins: [
    // extract vendor code into a separate file
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor", minChunks: module => /node_modules/.test(module.resource) })
  ]
});
