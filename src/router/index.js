import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import admin from '@/pages/admin'
import nav from '@/pages/nav'
import form from '@/pages/form'

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
      path: '/admin/projects',
      components: {
        nav: nav,
        content: admin
      }
    },
    {
      path: '/admin/projects/new',
      components: {
        nav: nav,
        content: form
      }
    },
    {
      path: '/admin/projects/edit/:id',
      components: {
        nav: nav,
        content: form
      }
    }
  ]
})
