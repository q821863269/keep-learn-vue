
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// global css
import '@/styles/index.scss'
// icon
import './icons'
// permission control
import './permission'

// global filters
import * as filters from './filters'

// 移除浏览器提示 Added non-passive event listener to a scroll-blocking...
import 'default-passive-events'

import Pagination from '@/components/Pagination'
import permission from '@/directive/permission'
// 全局组件挂载
Vue.component('Pagination', Pagination)
// 全局指令注册
Vue.use(permission)

// set element-ui default size
Vue.use(Element, {
  size: 'medium'
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
