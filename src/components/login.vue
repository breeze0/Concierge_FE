<template>
  <div class="login-com-container">
    <el-card class="box-card">
      <div slot="header" class="login-title">
        <span>手机登录</span>
      </div>
      <div class="login-content">
        <div class="input-container">
          <input type="text" class="login-input"
          v-model="inputTel"
          @blur="handleBlur"
          placeholder="请输入手机号码"
          >
        </div>
        <div class="error-msg">
          <span v-show='isShowTelError'>{{ telErrorMsg }}</span>
        </div>
        <div class="input-wrapper">
          <div class="input-msg-container">
            <input type="number" class="login-input" v-model="inputNum" placeholder="请输入6位短信验证码">
          </div>
          <el-button type="text"
          @click="getCode"
          :disabled="disabled">{{ btnVal }}</el-button>
        </div>
        <div class="error-msg">
          <span v-show="isShowNumError">{{ numErrorMsg }}</span>
        </div>
        <el-button type="primary" class="login-btn"
        @click="login">登录</el-button>
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
        countdown: 5,
        telErrorMsg: '请输入正确的手机号',
        numErrorMsg: '请输入正确的短信验证码',
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
          this.$http.get(this.server + '/login?tel='+this.inputTel+'&code='+this.inputNum).then((res)=>{
            if(res.data.state == 'success') {
              var expire = 1000 * 60 * 60 * 36;
              this.setCookie('tel', this.inputTel, expire);
              this.setCookie('token', res.data.token, expire);
              this.$router.push('/admin');
            } else {
              this.isShowNumError = true
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
            this.countdown = 5;
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
          this.$http.get(this.server+ '/login?tel='+this.inputTel).then((response)=>{
            if(response.data.state == 'fail') {
              this.isShowTelError = true;
            }
          })
        }
      }
    }
  }
</script>
