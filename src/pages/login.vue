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
                 v-model="inputTel"
                 @blur="handleBlur"
                 placeholder="请输入手机号码"
                 maxlength="11">
          <div class="error-msg tel-error">
            <span v-show='isShowTelError'>请输入正确的手机号</span>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="input-msg-container">
            <input type="number" class="login-input message-input" v-model="inputNum" placeholder="请输入6位短信验证码">
          </div>
          <el-button type="text"
          @click="getCode"
          :disabled="disabled">{{ btnVal }}</el-button>
          <div class="error-msg code-error">
            <span v-show="isShowNumError">请输入正确的短信验证码</span>
          </div>
        </div>
        <el-button type="primary" class="login-btn"
        @click="login" :disabled="inputTel == '' || inputNum == '' ">登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        inputTel: '',
        inputNum: '',
        isShowTelError: false,
        isShowNumError: false,
        disabled: false,
        countdown: 60,
        btnVal: '获取短信验证码'
      }
    },
    methods: {
      isAvailable(val) {
        var reg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(val)) {
          return false;
        } else {
          return true;
        }
      },

      handleBlur() {
        this.isShowTelError = !this.isAvailable(this.inputTel);
      },

      login() {
        if(this.inputTel == '') {
          this.isShowTelError = true;
        }
        if(this.inputNum.length != 6 ) {
          this.isShowNumError = true;
        }

        if(this.isAvailable(this.inputTel) && this.inputNum.length == 6) {
          var formdata = new FormData();
          formdata.append('tel', this.inputTel);
          formdata.append('code', this.inputNum);
          this.axios.post(this.server+'/login', formdata).then((res)=>{
            this.setCookie('token',res.headers.authorization,this.expire);
            this.$router.push('/admin/projects');
          }).catch(error => {
            if(error.response.status === 403) {
              this.isShowNumError = true;
            }
          })
        }
      },

      countDown() {
        this.isShowTelError = !this.isAvailable(this.inputTel)
        if(!this.isShowTelError) {
          if(this.countdown == 0) {
            this.disabled = false;
            this.btnVal = '获取短信验证码';
            this.countdown = 60;
            return;
          } else {
            this.disabled = true;
            this.btnVal = this.countdown+'秒后重新获取';
            this.countdown--;
          }
          var _this = this;
          setTimeout(function() {
            _this.countDown()
          },1000);
        }
      },

      getCode() {
        this.countDown();
        if(this.isAvailable(this.inputTel)) {
          var formdata = new FormData();
          formdata.append('tel',this.inputTel);
          this.$http.post(this.server+ '/code',formdata).catch(error=>{
            if(error.response.status === 403) {
              this.isShowTelError = true;
            }
          })
        }
      }
    }
  }
</script>
