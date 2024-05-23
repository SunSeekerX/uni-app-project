import { mapState } from 'vuex'

import App from './App'
import uView from '@/uni_modules/uview-ui'

// #ifndef VUE3
import Vue from 'vue'

Vue.config.productionTip = false
Vue.use(uView)
Vue.mixin({
  computed: {
    ...mapState(['token', 'userInfo', 'systemInfo']),
  },
})

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
