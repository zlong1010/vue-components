const path = require('path');
const { name: packageName } = require('./package.json');

// 解析文件绝对路径
function resolveDir(dir) {
  return path.resolve(__dirname, dir);
}

console.log(`\n${process.env.NODE_ENV} 环境\n`);
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: resolveDir('./docs'),
  configureWebpack: {
    resolve: {
      alias: {
        '@cmp': resolveDir('components'), // 组件目录
        '@dire': resolveDir('directives'), // 指令目录
      },
    },
    // 支持qiankun, 把子应用打包成 umd 库格式
    output: {
      // library: `${packageName}-[name]`,
      // libraryTarget: 'umd',
      // jsonpFunction: `webpackJsonp_${packageName}`,
      filename: 'js/[name]-[hash:6].js',
      chunkFilename: 'js/[name]-chunk-[hash:6].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      // runtimeChunk: 'single',
      // splitChunks: {
      //   cacheGroups: {
      //     vendor: {
      //       test: /[\\/]node_modules[\\/]/,
      //       name: 'vendors',
      //       chunks: 'all',
      //     },
      //   },
      // },
    },
  },
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
};
