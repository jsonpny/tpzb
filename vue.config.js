
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    open: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://172.16.0.63',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
}
