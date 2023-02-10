import Vue from 'vue'
import VueRouter from 'vue-router'
//引入nprogress 进度条插件
import NProgress from 'nprogress'
Vue.use(VueRouter)

// 导入一下vuex, 解决一下刷新页面activeIndex初始化的问题
import vuex from '@/store/index'


// 简单配置  进度条,可以不配置：在axios中我们不再做配置，以用来区分。
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


// 解决vue2跳转当前路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

import { routes } from './routes'
import { qrcodeLoginCheck } from '@/requests/login'
const router = new VueRouter({
  mode: 'history',
  routes
})

// 页面路由刚开始切换的时候
router.beforeEach(async (to, from, next) => {
  // 因为vuex的特性, 一刷新就初始化, 但是项目只要没有刷新, 跳转页面是不会初始化的
  // 页面收藏这个判断, vuex中跳转页面就默认变成false吧, 判断由网络请求来
  vuex.commit('changeColectStatus', false)



  let token = localStorage.getItem('userToken');
  if (from.name == 'loging' || to.name == 'loging') {
    // 排除掉loging这个页面
    // console.log('要跳到login这个页面了, 不许记录!');
  } else {
    localStorage.setItem('beforeUrl', location.href)
  }
  // 根据登录状态, 决定要哪些页面进不去(应该是根据token吧, vuex没法持续状态,一刷就没了)
  // console.log(to);
  // 未登录状态通过链接进入创作中心,拦住!
  if (to.name == 'createcenter' && !token) {
    alert('请先登录');
    vuex.commit('changeLoginShow', true);
    return;
  }
  // 未登录状态进入编辑器,拦住!
  if (to.name == 'editor' && !token) {
    alert('请先登录');
    return;
  }

  if (!token) {
    if (to.name == 'home' || to.name == 'script' || to.name == 'about' || to.name == "scriptdetail" || to.name == "loging") {
      next()
    }
  }


  // 导入了vuex直接调用更改activeIndex的mutation中的方法
  if (to.name == 'home') {
    vuex.commit('changeActiveIndex', 0)
  } else if (to.name == 'script') {
    vuex.commit('changeActiveIndex', 1)
  } else if (to.name == 'author') {
    vuex.commit('changeActiveIndex', 2)
  } else if (to.name == 'about') {
    vuex.commit('changeActiveIndex', 3)
  }

  // 开启进度条
  NProgress.start();

  next();


})

// 页面路由切换完毕的时候
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router