<template>
  <div>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item>双皮奶</el-dropdown-item>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout()
        }
      },
      logout() {
        this.$http.get('http://192.168.31.208/logout?tel='+ this.getCookie('tel') +'&token='+ this.getCookie('token')).then((res) => {
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