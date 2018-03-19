<template>
  <div class="nav-com-container">
    <span class="nav-title">预约系统</span>
    <div class="drop-wrapper">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link nick-name">
          {{ nickeName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改个人消息</el-dropdown-item>
          <el-dropdown-item>查看回收站</el-dropdown-item>
          <el-dropdown-item>我的邀请</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        nickeName: '晨晨'
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout()
        }
      },
      logout() {
        this.$http.get(this.server + '/logout?tel='+ this.getCookie('tel') +'&token='+ this.getCookie('token')).then((res) => {
          console.log(res.data)
          if(res.data.state == 'success') {
            this.delCookie('tel');
            this.delCookie('token');
            this.$router.push('/login');
          }
        })
      }
    }
  }
</script>
