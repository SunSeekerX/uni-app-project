import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import * as uniapp from './uni-app'

const isNil = (value) => value === null || value === undefined
const isObjectLike = (value) => value && typeof value === 'object' && !Array.isArray(value)

dayjs.extend(localizedFormat)
dayjs.locale('en')

export { dayjs, uniapp }

// Constant
export const constant = {}

// Env
export const defaultConfig = {
  // 默认环境（H5 打包不受这个配置影响）- dev | prod
  defaultEnv: 'prod',
  defaultLocale: 'en_US',
}
export const env = {
  appEnv: process.env.VUE_APP_ENV || defaultConfig.defaultEnv,
}
export const envs = {
  dev: {
    BASE_URL: 'https://express.yoouu.cn',
  },
  prod: {
    BASE_URL: 'https://express.yoouu.cn',
  },
}
export const getEnv = (key) => {
  const val = envs?.[env.appEnv]?.[key]
  if (val == null) {
    console.error(`ENV: Cannot get the ${key} value!`)
  }
  return val
}

// I18n

// Tools
export const tools = {
  isNil,
  isObjectLike,
  removeObjNilVal: (obj) => {
    const removeNil = (currentObj) => {
      const result = Array.isArray(currentObj) ? [] : {}
      for (const [key, value] of Object.entries(currentObj)) {
        if (!isNil(value)) {
          if (isObjectLike(value)) {
            result[key] = removeNil(value)
          } else {
            result[key] = value
          }
        }
      }
      return result
    }

    return removeNil(obj)
  },
  executeOnceAtATime: (func) => {
    let isExecuting = false
    return function () {
      if (isExecuting) {
        return function () {}
      }
      isExecuting = true
      const context = this
      const args = arguments
      return func.apply(context, args).finally(() => {
        isExecuting = false
      })
    }
  },
}

// Apis
let loadingCount = 0
const showLoading = () => {
  if (loadingCount === 0) {
    uni.showLoading({ title: '', mask: true })
  }
  loadingCount++
}
const hideLoading = () => {
  loadingCount--
  if (loadingCount === 0) {
    uni.hideLoading()
  }
}
export const createRequest = (baseOptions, customOptions = {}) => {
  const http = new uniapp.HttpRequest(baseOptions, customOptions)

  http.setReqInterceptor(async (reqInfo) => {
    // const appStore = useAppStore()
    if (['get', 'GET'].includes(reqInfo.method)) {
      reqInfo.data = { ...reqInfo.data, _t: new Date().getTime() }
    }
    reqInfo.data = tools.removeObjNilVal(reqInfo.data || {})
    // if (appStore.mState.token) {
    //   reqInfo['header']['token'] = appStore.mState.token
    // }
    // reqInfo['header']['language'] = i18n.global.locale.value
    return reqInfo
  })

  http.setResInterceptor(async (res) => {
    return res.data
  })

  const tokenExpire = () => {
    // const appStore = useAppStore()
    // setTimeout(() => {
    //   appStore.onLoginOut()
    //   uniapp.route({
    //     url: '/',
    //     type: 'reLaunch',
    //   })
    // }, 18)
  }

  http.req = async (reqInfo, reqConfig) => {
    const shouldShowLoading =
      reqConfig?.showLoading !== undefined ? reqConfig.showLoading : http.customConfig.showLoading
    if (shouldShowLoading) {
      showLoading()
    }
    try {
      if (reqInfo.method.toUpperCase() === 'UPLOAD') {
        const res = await http.upload(reqInfo, reqConfig)
        return Promise.resolve(res)
      } else {
        const res = await http.request(reqInfo, reqConfig)
        if (res?.code === -1001) {
          tokenExpire()
        }
        return Promise.resolve(res)
      }
    } catch (res) {
      console.error(res)
      const packRes = {}
      if (res instanceof Error) {
        console.error('Frontend code error detected:', { res, config: reqInfo, reqConfig })
        packRes['success'] = false
        packRes['msg'] = 'Program running error'
      } else {
        console.error('Backend service error detected:', { res, config: reqInfo, reqConfig })
        packRes['success'] = false
        packRes['msg'] = 'Internal server error'
        if (res?.data?.code === 'A401') {
          tokenExpire()
        }
      }
      return customOptions.packErr ? Promise.resolve(packRes) : Promise.reject(packRes)
    } finally {
      if (shouldShowLoading) {
        hideLoading()
      }
    }
  }

  return http
}
const baseHttp = createRequest({
  baseURL: getEnv('BASE_URL'),
  withCredentials: false,
  // header: {
  //   'content-type': 'application/x-www-form-urlencoded',
  // },
})
export const api = {
  get: (data) => baseHttp.req({ url: '/get', method: 'GET', data }),
}

// Store
