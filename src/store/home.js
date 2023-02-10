import router from '@/router/index'
const state = {
  activeIndex: 0,
  isLogin: false,
  loginShow: false,
}

const actions = {

}

const mutations = {
  // 改变导航栏下面的黄色提示条
  changeActiveIndex(state, index) {
    state.activeIndex = index;
    // console.log(router.currentRoute);
  },
  // 控制登录组建的显示和隐藏
  changeLoginShow(state) {
    state.loginShow = !state.loginShow
  },
  // 改变登录状态
  changeLogin(state, flag) {
    state.isLogin = flag
  }

}

export default {
  state, actions, mutations
}