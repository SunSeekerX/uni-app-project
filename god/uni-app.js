export class HttpRequest {
  constructor(baseConfig = {}, customConfig = {}) {
    this.baseConfig = {
      baseURL: '',
      header: {},
      method: 'GET',
      timeout: 60000,
      dataType: 'json',
      responseType: 'text',
      sslVerify: true,
      withCredentials: false,
      firstIpv4: false,
      enableHttp2: false,
      enableQuic: false,
      enableCache: false,
      enableHttpDNS: false,
      httpDNSServiceId: '',
      enableChunked: false,
      forceCellularNetwork: false,
      enableCookie: false,
      cloudCache: false,
      defer: false,
      ...baseConfig,
    }
    this.customConfig = {
      showLoading: true,
      ...customConfig,
    }

    this.interceptors = {
      request: async (reqInfo) => reqInfo,
      response: async (response) => response.data,
    }

    this.setReqInterceptor = (cb) => {
      this.interceptors.request = cb
    }

    this.setResInterceptor = (cb) => {
      this.interceptors.response = cb
    }
  }

  async request(reqInfo, reqConfig) {
    reqInfo = { ...this.baseConfig, ...reqInfo }
    reqInfo.url = this.baseConfig.baseURL + reqInfo.url
    if (this.interceptors.request) {
      try {
        reqInfo = (await this.interceptors.request(reqInfo, reqConfig)) || reqInfo
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return new Promise((resolve, reject) => {
      uni.request({
        ...reqInfo,
        success: async (response) => {
          if (this.interceptors.response) {
            try {
              response = (await this.interceptors.response(response)) || response
            } catch (error) {
              return reject(error)
            }
          }
          resolve(response)
        },
        fail: (error) => {
          reject(error)
        },
      })
    })
  }

  get(url, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'GET', ...reqInfo }, reqConfig)
  }

  post(url, data, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'POST', data, ...reqInfo }, reqConfig)
  }

  put(url, data, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'PUT', data, ...reqInfo }, reqConfig)
  }

  delete(url, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'DELETE', ...reqInfo }, reqConfig)
  }

  async upload(reqInfo, reqConfig) {
    reqInfo.header = { ...this.baseConfig.header, ...reqInfo.header }
    delete reqInfo.header['content-type']
    delete reqInfo.header['Content-Type']
    if (this.interceptors.request) {
      try {
        reqInfo = (await this.interceptors.request(reqInfo, reqConfig)) || reqInfo
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        ...reqInfo,
        success: async (response) => {
          if (this.interceptors.response) {
            try {
              response = (await this.interceptors.response(response)) || response
            } catch (error) {
              return reject(error)
            }
          }
          resolve(response)
        },
        fail: (error) => {
          reject(error)
        },
      })
    })
  }

  validateStatus(statusCode) {
    return statusCode >= 200 && statusCode < 300
  }
}

let isRouting = false
export const route = (options) => {
  if (isRouting) {
    return
  }
  isRouting = true
  const { url, type = 'navigateTo', delta = 1, success, fail, complete } = options
  const handleComplete = (result) => {
    if (typeof complete === 'function') complete(result)
    isRouting = false
  }
  const commonCallback = {
    success: (result) => {
      if (typeof success === 'function') success(result)
    },
    fail: (e) => {
      console.warn(e)
      if (typeof fail === 'function') fail(e)
    },
    complete: handleComplete,
  }

  switch (type) {
    case 'navigateTo':
      uni.navigateTo({ url, ...commonCallback })
      break
    case 'redirectTo':
      uni.redirectTo({ url, ...commonCallback })
      break
    case 'reLaunch':
      uni.reLaunch({ url, ...commonCallback })
      break
    case 'switchTab':
      uni.switchTab({ url, ...commonCallback })
      break
    case 'navigateBack':
      uni.navigateBack({ delta, ...commonCallback })
      break
    default:
      console.warn('Invalid navigation type')
      isRouting = false
  }
}

export const toast = (msg, { ...options } = {}) =>
  uni.showToast({ icon: 'none', title: msg, duration: 2000, ...options })

export const copy = (value, { msg = '' } = {}) => {
  uni.setClipboardData({
    data: String(value),
    showToast: false,
    complete: () => {
      uni.hideToast()
      if (msg) toast(msg)
    },
  })
}

export const setClipboardData = async (options = {}) => {
  const { showToast = false, ...restOptions } = options
  return await uni.setClipboardData({ showToast, ...restOptions })
}

export const openUrl = (url, { openInCurrentTab = false, openInAppBrowser = true } = {}) => {
  const encodeUrl = encodeURI(decodeURIComponent(url))

  // #ifdef APP-PLUS
  if (openInAppBrowser) {
    plus.runtime.openWeb(encodeUrl)
  } else {
    plus.runtime.openURL(encodeUrl)
  }
  // #endif

  // #ifdef H5
  if (openInCurrentTab) {
    window.open(encodeUrl, '_self')
  } else {
    window.open(encodeUrl, '_blank')
  }
  // #endif
}
