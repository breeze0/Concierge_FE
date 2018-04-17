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
                     :disabled="codeButtonDisabled">
            {{ btnVal }}
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
  const BUTTON_VALUE = {
    'default': '获取短信验证码',
    'waiting': '秒后重新获取'
  }
  export default {
    data () {
      return {
        tel: '',
        code: '',
        telError: false,
        numError: false,
        codeButtonDisabled: false,
        countdownRange: 10,
        btnVal: BUTTON_VALUE.default
      }
    },
    methods: {
      validate(val) {
        var reg=/^1[34578][0-9]{9}$/;
        return reg.test(val)
      },

      login() {
        if(this.validate(this.tel) && this.code.length == 6) {
          var data = {
            'tel': this.tel,
            'code': this.code
          }
          this.$http.post(this.GLOBAL.requestUrls.login, data).then((res)=>{
            this.setCookie('token',res.headers.authorization,this.expire);
            this.$router.push(this.GLOBAL.routers.projects);
          }).catch(error => {
            if(error.response.status === 422) {
              this.numError = true;
            }
          })
        }
      },

      countdown() {
        if(!this.telError) {
          if(this.countdownRange == 0) {
            this.codeButtonDisabled = false;
            this.btnVal = BUTTON_VALUE.default;
            this.countdownRange = 10;
            return;
          } else {
            this.codeButtonDisabled = true;
            this.btnVal = this.countdownRange + BUTTON_VALUE.waiting;
            this.countdownRange--;
          }
          setTimeout(() => {
            this.countdown()
          },1000);
        }
      },

      getCode() {
        this.telError = !this.validate(this.tel);
        this.countdown();
        if(this.validate(this.tel)) {
          var data = {
            'tel': this.tel
          }
          this.$http.post(this.GLOBAL.requestUrls.code, data).catch(error=>{
            if(error.response.status === 422) {
              this.telError = true;
            }
          })
        }
      }
    }
  }
</script>
