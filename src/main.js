import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index'
import router from '@/router/index'


// import 'element-ui/lib/theme-chalk/index.css';
// import { Carousel, CarouselItem } from 'element-ui'
import { Pagination, Upload, Radio, RadioGroup, Message, Button, Select, Input, Option } from 'element-ui'
import 'nprogress/nprogress.css'


Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}

Vue.use(Pagination)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Message)
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
// Vue.use(Carousel)
// Vue.use(CarouselItem)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
