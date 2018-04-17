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
            <span v-show='isShowTelError'>请输入正确的手机号</span>
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
            <span v-show="isShowNumError">请输入正确的短信验证码</span>
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
  export default {
    data () {
      return {
        tel: '',
        code: '',
        isShowTelError: false,
        isShowNumError: false,
        codeButtonDisabled: false,
        countdownRange: 10,
        btnVal: '获取短信验证码'
      }
    },
    methods: {
      isAvailable(val) {
        var reg=/^1[3|4|5|7|8][0-9]{9}$/;
        return reg.test(val)
      },

      login() {
        if(this.isAvailable(this.tel) && this.code.length == 6) {
          // var formdata = new FormData();
          // formdata.append('tel', this.tel);
          // formdata.append('code', this.code);
          var data = {
            'tel': this.tel,
            'code': this.code
          }
          this.$http.post(this.GLOBAL.server+'/login', data).then((res)=>{
            this.setCookie('token',res.headers.authorization,this.expire);
            this.$router.push('/admin/projects');
          }).catch(error => {
            if(error.response.status === 422) {
              this.isShowNumError = true;
            }
          })
        }
      },

      countdown() {
        if(!this.isShowTelError) {
          if(this.countdownRange == 0) {
            this.codeButtonDisabled = false;
            this.btnVal = '获取短信验证码';
            this.countdownRange = 10;
            return;
          } else {
            this.codeButtonDisabled = true;
            this.btnVal = this.countdownRange+'秒后重新获取';
            this.countdownRange--;
          }
          setTimeout(() => {
            this.countdown()
          },1000);
        }
      },

      getCode() {
        this.isShowTelError = !this.isAvailable(this.tel);
        this.countdown();
        if(this.isAvailable(this.tel)) {
          // var formdata = new FormData();
          // formdata.append('tel',this.tel);
            var data = {
              'tel': this.tel
            }
            var config = {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              }
            }
          this.$http.post(this.GLOBAL.server+ '/code',data).catch(error=>{
            if(error.response.status === 422) {
              this.isShowTelError = true;
            }
          })
        }
      }
    }
  }
</script>
