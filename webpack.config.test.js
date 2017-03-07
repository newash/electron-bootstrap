const glob = require("glob");

const config = require("./webpack.config.base");
module.exports = Object.assign(config, {
  entry: {
    test: glob.sync("./renderer/**/*.spec.ts").map(path => "mocha-loader!" + path)
  },
  target: "web",
  devServer: {
    port: "9000"
  }
});
