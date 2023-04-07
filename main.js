import { mapState } from 'vuex'

import utools from '@/uni_modules/limm-utools'
import uView from '@/uni_modules/uview-ui'

import App from './App'
import store from './store/index' // Vuex
import * as util from './utils/index' // 工具包
import * as constant from './constant' // 常量
import * as api from './apis' // Api
import getEnv from './config/index' // 环境变量获取

// #ifndef VUE3
import Vue from 'vue'

Vue.config.productionTip = false
Vue.use(uView)
Vue.mixin({
  computed: {
    ...mapState(['token', 'userInfo', 'systemInfo']),
  },
})

Vue.prototype.$util = util
Vue.prototype.$utools = utools
Vue.prototype.$store = store
Vue.prototype.$constant = constant
Vue.prototype.$api = api
Vue.prototype.$getEnv = getEnv
App.mpType = 'app'

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}
try {
  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0])
          } else {
            resolve(res[1])
          }
        })
      })
    },
  })
} catch (error) {
  console.error(error)
}

const app = new Vue({
  ...App,
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
// #endif
