const { resolve } = require('path');
const { name: packageName } = require('./package.json');

console.log(`\n${process.env.NODE_ENV} 环境\n`);
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: resolve(__dirname, './docs'),
  devServer: {
    port: '9000',
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@cmp': resolve('components'), // 组件目录
        '@dire': resolve('directives'), // 指令目录
      },
    },
    // 支持qiankun, 把子应用打包成 umd 库格式
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`,
      filename: 'js/[name]-[hash:6].js',
      chunkFilename: 'js/[name]-[hash:6].js',
    },
  },
};
