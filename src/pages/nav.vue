<template>
  <div class="nav-com-container">
    <span class="nav-title">预约系统</span>
    <div class="drop-wrapper">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link nick-name">
          {{ nickName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
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
        nickName: '管理员'
      }
    },
    created() {
      this.nickName = this.getCookie('name');
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout()
        }
      },
      logout() {
        this.delCookie('token');
        this.$router.push(this.GLOBAL.routers.login);
      }
    }
  }
</script>
