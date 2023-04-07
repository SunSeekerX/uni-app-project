import createRequest from './request'
import getEnv from '@/config/index'

// 导出测试请求对象
export const expressRequest = createRequest({
  baseUrl: getEnv('EXPRESS_BASE_URL'),
  withCredentials: false,
})
