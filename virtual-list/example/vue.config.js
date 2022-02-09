const path = require('path')

// https://cli.vuejs.org/config/#global-cli-config

console.log(`\n${process.env.NODE_ENV} 环境\n`);
module.exports = {
  publicPath: './',

  outputDir: path.resolve(__dirname, '../docs'),

  productionSourceMap: false
}
