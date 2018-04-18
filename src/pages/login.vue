<template>
  <div class="login-com-container" style="background-image: url('./static/images/login.jpg');">
    <el-card class="box-card">
      <div class="login-title">
        <span class="title-zn">预约管理系统</span>
        <span class="title-en">Reservation Management System</span>
      </div>
      <div class="login-content">
        <div class="input-container">
          <input type="text"
                 class="login-input"
                 placeholder="请输入手机号码"
                 maxlength="11"
                 v-model="tel">
          <div class="error-msg tel-error">
            <span v-show='telError'>请输入正确的手机号</span>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="input-msg-container">
            <input type="number"
                   class="login-input message-input"
                   v-model="code"
                   placeholder="请输入6位短信验证码">
          </div>
          <el-button type="text"
                     @click="getCode"
                     :disabled="counting">
            {{ codeButtonText }}
          </el-button>
          <div class="error-msg code-error">
            <span v-show="numError">请输入正确的短信验证码</span>
          </div>
        </div>
        <el-button type="primary"
                   class="login-btn"
                   @click="login"
                   :disabled="tel == '' || code == '' ">
          登录
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  const BUTTON_TEXT = {
    'default': '获取短信验证码',
    'counting': '秒后重新获取'
  }
  export default {
    data () {
      return {
        tel: '',
        code: '',
        telError: false,
        numError: false,
        countdownRange: 60,
        counting: false
      }
    },
    computed: {
      codeButtonText() {
        if(this.counting) {
          return `${this.countdownRange}${BUTTON_TEXT.counting}`
        } else {
          return `${BUTTON_TEXT.default}`
        }
      }
    },
    methods: {
      validate() {
        var reg =/^1[34578][0-9]{9}$/;
        return reg.test(this.tel)
      },

      login() {
        if(this.validate() && this.code.length == 6) {
          var data = {
            tel: this.tel,
            code: this.code
          }
          this.$http.post(this.GLOBAL.requestUrls.login, data).then((res)=>{
            this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
            this.$router.push(this.GLOBAL.routers.projects);
          }).catch(error => {
            if(error.response.status === 422) {
              this.numError = true;
            }
          })
        } else if(this.validate() && !this.code.length == 6) this.numError = true;
          else if(!this.validate() && this.code.length == 6) this.telError = true;
          else {
            this.telError = true;
            this.numError = true;
          }
      },

      countdown() {
        this.counting = true;
        this._count();
      },

      getCode() {
        this.telError = !this.validate();
        if (this.telError) return;
        this.countdown();
        var data = {
          tel: this.tel
        }
        this.$http.post(this.GLOBAL.requestUrls.code, data).catch(error=>{
          if(error.response.status === 422) {
            this.telError = true;
          }
        })
      },
      _count() {
        if(this.countdownRange === 0) {
          this.counting = false;
          this.countdownRange = 60;
          return;
        } else {
          this.countdownRange--;
          setTimeout(this._count, 1000);
        }
      }
    }
  }
</script>
