/**
 * 去除对象中有 [undefined, null, ''] 的情况
 * @param { Object } obj
 * @returns { Object } 处理完成之后的对象
 */
export function removeEmptyKey(obj = {}) {
  // 处理参数为 [undefined, null, ''] 情况
  for (const [key, value] of Object.entries(obj)) {
    if ([undefined, null, ''].includes(value)) {
      delete obj[key]
    }
  }
  return obj
}
