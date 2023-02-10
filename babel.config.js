module.exports = {
  // 这是创建项目初始化自带的
  presets: ["@vue/cli-plugin-babel/preset"],
  // 这里是我们需要添加的
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
}; 