import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { getToken, getRefreshToken } from '@/utils/auth'
import { getToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 正在刷新标识，避免重复刷新
// let refreshing = false
// 请求等待队列
// let waitQueue = []

service.interceptors.response.use(({ config, data }) => {
  const { code, msg } = data
  if (code !== '00000') {
    console.log(msg)
  } else {
    return data
  }
},
error => {
  return Promise.reject(error)
}
)

export default service
