
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    open: true,
    port: 8080,
    proxy: {
      '/piclive': {
        target: 'http://172.16.0.61:8080',
        // target: 'http://view.jingjiribao.cn/piclive',
        changeOrigin: true,
        pathRewrite: { '^/piclive': '' }
      }
    }
  }
}
