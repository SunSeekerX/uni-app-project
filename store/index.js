// 导入依赖库
import Vue from 'vue'
import Vuex from 'vuex'

// 挂载全局组件和安装插件
Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    // App 系统信息
    systemInfo: {},
  },

  mutations: {
    // 更新获取系统信息
    UPDATE_SYSTEM_INFO(state) {
      state.systemInfo = uni.getSystemInfoSync()
    },
  },

  actions: {},
})
