import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import admin from '@/components/admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: admin
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/admin',
      component: admin
    }
  ]
})
