import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/assets/css/global.css'
import moment from 'moment'
Vue.prototype.$moment = moment
Vue.use(ElementUI)
Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.filter('getTypeNameBycode', function (code, projectTypes) {
  const item = projectTypes.find(item => item.code === code)
  return item.name
})
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
