// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

Vue.prototype.setCookie = (name, value, expiredays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);　　　　
  document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

Vue.prototype.getCookie = getCookie;


Vue.prototype.delCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    token: ''
  },

  created() {
    var _this = this;
    this.$http.get('http://192.168.31.208').then((response)=>{
      _this.token = response.data.token;
    })
    setTimeout(function() {
      _this.checkLogin()
    },2000)
  },
  mounted() {

  },
  watch: {
    $route(to, from) {
      this.checkLogin();
    }
  },

  methods: {
    checkLogin() {
      var cookie = document.cookie.split(';');
      var tokenInCookie = cookie[2].trim().slice(6);
      if(!tokenInCookie) {
        this.$router.push('/login')
      } else if(tokenInCookie == this.token) {
        if(this.$route.path == '/login') {
          this.$router.push('/admin')
        } else {
          this.$router.push(this.$route.path)
        }
      } else {
        this.$router.push('/login')
      }
    }
  }
 })
