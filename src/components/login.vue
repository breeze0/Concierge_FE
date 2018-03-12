<template>
  <div class="login-container">
    <el-card class="box-card">
      <div slot="header" class="login-title">
        <span>手机登录</span>
      </div>
      <div class="login-content">
        <div class="el-input">
          <input type="text" class="el-input__inner"
          v-model="inputTel"
          placeholder="请输入手机号码"
          @blur="handleBlur"
          >
        </div>
        <div class="error-msg">
          <span v-show='isShowError'>{{ numErrorMsg }}</span>
        </div>
        <div class="input-wrapper">
          <div class="el-input">
            <input type="number" class="el-input__inner" v-model="inputNum" placeholder="请输入6位短信验证码">
          </div>
          <el-button type="primary" round>获取验证码</el-button>
        </div>
        <el-button type="primary" class="login-btn">登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        inputTel: null,
        inputNum: null,
        isShowError: false,
        numErrorMsg: '请输入正确的手机号'
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
        this.isShowError = !this.isAvailable(this.inputTel)
      }

    },
    watch: {

    },
    mounted () {

    }
  }
</script>

<style scoped lang="scss">

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}


.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;


  .box-card {
    width: 480px;
    height: 300px;

    .login-title {
      text-align: center;
    }
  }

  .login-content {
    .el-input {
      text-align: center;

      .el-input__inner {
        width: 80%;
      }
    }
    .error-msg {
      margin-left: 10%;
      color: #F56C6C;
      font-size: 12px;
      min-height: 20px;
    }

    .input-wrapper {
      margin-top: 20px;
      display: flex;
      width: 80%;
      margin-left: 10%;

      .el-input__inner {
        width: 90%!important;
        margin-right: 10%;
      }
    }

    .login-btn {
      margin-left: 10%;
      width: 80%;
      margin-top: 40px;
    }
  }

}
</style>