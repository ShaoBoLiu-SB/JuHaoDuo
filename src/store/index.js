import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import home from './home.js'
import script from './script.js'
import createCenter from './createCenter.js'

export default new Vuex.Store({
  modules: {
    home,
    script,
    createCenter
  }
})