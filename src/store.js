import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {
    loginSuccess(store, param){ //在 http.js 里通过引入 store, 直接通过store.commit('loginSuccess',值)，修改了，不用在写action了。
      store.token = param;
    }
  },
  actions: {

  }
})
