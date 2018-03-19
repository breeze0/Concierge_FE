import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import admin from '@/components/admin'
import nav from '@/components/nav'
import form from '@/components/form'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      components: {
        nav: nav,
        content: admin
      }
    },
    {
      path: '/login',
      components: {
        nav: '',
        content: login
      }
    },
    {
      path: '/admin',
      components: {
        nav: nav,
        content: admin
      }
    },
    {
      path: '/admin/new',
      components: {
        nav: nav,
        content: form
      }
    }
  ]
})
