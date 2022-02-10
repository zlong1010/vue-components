'use strict';
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const nodeEnv = process.env.NODE_ENV;
const projectName = process.env.PROJECT_NAME;
const isProd = nodeEnv === 'production';

console.log(`当前环境: ${nodeEnv}`);
console.log(`当前项目: ${projectName}`);

module.exports = {
  pages: {
    index: {
      entry: `src/project/${projectName}/main.js`, // 项目入口
      template: `src/project/${projectName}/public/index.html`, // 项目HTML模板
    },
  },
  publicPath: '/',
  outputDir: `src/project/${projectName}/dist`,
  assetsDir: 'assets',
  lintOnSave: !isProd,
  productionSourceMap: false,
  devServer: {
    port: '8080',
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  css: {
    extract: {
      filename: 'assets/[name]-[hash].css',
      chunkFilename: 'assets/[name]-[hash].css',
      ignoreOrder: true,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve(`src/project/${projectName}`), // 当前项目别名
        '#': resolve('src'), // 公共资源别名
      },
    },
    output: {
      filename: 'assets/[name]-[hash].js',
      chunkFilename: 'assets/[name]-[hash].js',
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/index.less')],
    },
  },
  chainWebpack: config => {
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    config.plugins.delete('prefetch-index').delete('preload-index');

    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        options.name = 'assets/[name]-[hash].[ext]';
        options.fallback = {
          loader: 'file-loader',
          options: {
            name: 'assets/[name]-[hash].[ext]',
          },
        };
        return options;
      });
  },
};
