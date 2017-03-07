const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const config = require("./webpack.config.base");
module.exports = Object.assign(config, {
  devtool: undefined,
  entry: {
    main: "./main/main.ts"
  },
  plugins: [
    // cheap-module-source-map equivalent
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
      moduleFilenameTemplate: "[resourcePath]", // get rid of "webpack:///" prefix
      module: true,
      columns: false,
      sourceRoot: "../" // {workspaceRoot} relative to ./output/
    })
  ],
  target: "electron",
  node: {
    __dirname: false
  },
  externals: [
    nodeExternals()
  ]
});
