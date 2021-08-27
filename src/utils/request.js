import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
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
  if (code === 0) {
    return data
  } else if (code === 1014 || code === 1015) {
    MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
    ).then(() => {
      store.dispatch('user/logout').then(() => {
        location.href = '/login'
      })
    })
  } else {
    const showMsg = `${code}：${msg}`
    Message({
      message: showMsg,
      type: 'error'
    })
    return Promise.reject(new Error(showMsg))
  }
},
(error) => {
  const { code, msg } = error.response.data
  if (code && msg) {
    const showMsg = `${code}：${msg}`
    Message({
      message: showMsg,
      type: 'error'
    })
  } else {
    Message({
      message: '有点不对劲~',
      type: 'error'
    })
  }
  return Promise.reject(error)
}
)

export default service
