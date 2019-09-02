module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "./" : "./",
  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
  outputDir: 'wep',
  lintOnSave: false,
  // pages:{ type:Object,Default:undfind }
  devServer: {
    port: 8888, // 端口号
    host: "127.0.0.1",
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      "/api": {
        target: "<url>",
        ws: true,
        changeOrigin: true
      },
      "/foo": {
        target: "<other_url>"
      }
    } // 配置多个代理
  },
  transpileDependencies: ['webpack-dev-server/client'],
  chainWebpack: config => {
    config.entry.app = ['babel-polyfill', './src/main.js'];
  }
};
