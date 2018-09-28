const webpack = require('webpack')
module.exports = {
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  pwa: {},
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/ngsp': {
        target: 'http://196.123.132.21:7072/', // 集成环境
        // target: 'http://196.123.132.21:27072/', // 开发环境
        // target: 'http://196.123.135.165:17072/', // 测试环境
        timeout: 3600000,
        changeOrigin: true,
        pathRewrite: {
          '^/ngsp': ''
        }
      }
    }
  },
  chainWebpack: config => {
  },
  assetsDir: './static'
}