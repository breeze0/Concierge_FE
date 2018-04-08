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
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

Vue.prototype.setCookie = setCookie;
Vue.prototype.getCookie = getCookie;
Vue.prototype.delCookie = delCookie;
Vue.prototype.server = 'http://192.168.31.208';
Vue.prototype.expire = 1000 * 60 * 60 * 36;

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
        this.$router.push('/login')
      } else {
        if(this.$route.path == '/login') {
          this.$router.push('/admin/projects');
        } else {
          this.$router.push(this.$route.path);
        }
      }
    }
  }
 })
