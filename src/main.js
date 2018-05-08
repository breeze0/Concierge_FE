// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import lrz from 'lrz'
import './stylesheets/index.scss'
import global from './components/global'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

function setCookie(name, value, expiretime) {
  var exp = new Date();
  exp.setTime(exp.getTime() + expiretime);　　
  document.cookie = name + "=" + escape(value) + ((expiretime == null) ? "" : ";expires=" + exp.toGMTString());
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var val = getCookie(name);
  if (val != null)
    document.cookie = name + "=" + val + ";expires=" + exp.toGMTString();
}

function getRequestConfig() {
  var config = {
    headers: {
      'Authorization': getCookie('token')
    }
  }
  return config;
}

function handleHttpError(err) {
  if(err.response.status === 401) {
    if(err.response.data === global.httpStateInfo.invalid_token) {
     delCookie('token');
     router.push(global.routers.login);
     ElementUI.Message.error('登录已过期，请重新登录。')
    } else {
      router.push(global.routers.projects);
    }
  }
}

Vue.prototype.setCookie = setCookie;
Vue.prototype.getCookie = getCookie;
Vue.prototype.delCookie = delCookie;
Vue.prototype.handleHttpError = handleHttpError;
Vue.prototype.getRequestConfig = getRequestConfig;
Vue.prototype.GLOBAL = global;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

  created() {
    this.checkLogin();
  },

  watch: {
    $route(to, from) {
      this.checkLogin();
    }
  },

  methods: {
    checkLogin() {
      if(!(this.getCookie('token'))) {
        this.$router.push(this.GLOBAL.routers.login)
      } else {
        if(this.$route.path == this.GLOBAL.routers.login) {
          this.$router.push(this.GLOBAL.routers.projects);
        } else {
          this.$router.push(this.$route.path);
        }
      }
    }
  }
 })
