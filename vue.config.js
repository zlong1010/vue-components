const { resolve } = require('path');

console.log(`\n${process.env.NODE_ENV} 环境\n`);
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: resolve(__dirname, './docs'),
  configureWebpack: {
    resolve: {
      alias: {
        '@cmp': resolve('components'), // 组件目录
        '@dire': resolve('directives'), // 指令目录
      },
    },
  },
};
