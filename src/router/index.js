import Vue from 'vue'
import VueRouter from 'vue-router'
import SpecialList from '@/views/specialManage/specialList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SpecialList',
    component: SpecialList
  },
  {
    path: '/specialDetail',
    name: 'specialDetail',
    component: () => import(/* webpackChunkName: "specialDetail" */ '@/views/specialManage/specialDetail.vue')
  },
  {
    path: '/picturesList',
    name: 'picturesList',
    component: () => import(/* webpackChunkName: "picturesList" */ '@/views/specialManage/specialDetail.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
