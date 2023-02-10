const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'http://dj.huashengbook.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'// 这里要理解成用'/api'代替target里面的地址，后面的组件中我们调用接口的时候直接用api代替，比如我要调用'http://40.00.100:3002/user/add'，直接写成'/api/user/add'即可
        }
      }
    }
  },

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局变量路径
        path.resolve(__dirname, "./src/assets/less/font.less"),
      ],
    }
  }
})


