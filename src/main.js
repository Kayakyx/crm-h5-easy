import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/css/reset.css'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import { Button, Toast } from 'vant'
import api from './request/api'
Vue.prototype.$api = api; //将所有接口挂载的vue实例原型上。
//使用axiso   格式：this.$http.get(api).then((response) => {console.log(response.data)})
//把axios 进行了封装，和接口的统一管理，所以这里就不用  Vue.use(VueAxios, axios)， 特别
// 是VueAxios,主要的作用就是把 axios挂载到vue实例上，和自己用Vue.
// Vue.use(VueAxios, axios)
Vue.use(Button)
Vue.use(Toast)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
