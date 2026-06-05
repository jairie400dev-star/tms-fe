import client from './client'

export const http = {
  get: (url, params) => client.get(url, { params }),
  post: (url, data) => client.post(url, data),
  put: (url, data) => client.put(url, data),
  delete: (url, config) => client.delete(url, config),
  request: (config) => client.request(config),
}
