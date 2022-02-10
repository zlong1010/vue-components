const path = require("path");

console.log(`\n${process.env.NODE_ENV} 环境\n`);
module.exports = {
  publicPath: "./",

  outputDir: path.resolve(__dirname, "./docs"),

  productionSourceMap: false,
};
