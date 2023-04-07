import { expressRequest } from '@/utils/request'

export default {
  get() {
    return expressRequest({
      url: '/get',
      method: 'GET',
      header: {
        headerParam1: 'headerParam1',
      },
    })
  },

  post() {
    return expressRequest({
      url: '/post',
      method: 'POST',
    })
  },

  put() {
    return expressRequest({
      url: '/put',
      method: 'PUT',
    })
  },

  delete() {
    return expressRequest({
      url: '/delete',
      method: 'DELETE',
    })
  },

  upload({ filePath, name, formData }) {
    return expressRequest({
      url: '/upload',
      method: 'UPLOAD',
      filePath,
      name,
      formData,
    })
  },
}
