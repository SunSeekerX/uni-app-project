/**
 * 环境变量入口
 */

import { defaultEnv } from './default'
import dev from './dev.config'
import stage from './stage.config'
import prod from './prod.config'

export const envs = {
  dev,
  stage,
  prod,
}

export const ENV = defaultEnv

/**
 * 获取环境变量
 * @param {String} key
 */
export default function getEnv(key) {
  const val = envs[ENV][key]
  if (![null, undefined].includes(val)) {
    return val
  } else {
    console.error(`ENV: Cannot get the ${key} value!`)
    return null
  }
}
