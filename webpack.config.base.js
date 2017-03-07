const path = require('path');
const assetsDir = path.join(__dirname, "assets");

module.exports = {
  devtool: "cheap-module-source-map",
  entry: {},
  output: {
    path: path.join(__dirname, "output"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: assetsDir, loader: "file-loader?name=[name].[ext]" },
      { test: /\.js$/, loader: "source-map-loader", exclude: /node_modules/, enforce: "pre" }
    ]
  },
  plugins: []
};
