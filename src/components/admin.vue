<template>
  <div class="admin-com-container">
    <div class="tabs-wrapper">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我拥有的预约项目" name="first">
          <div class="card-wrapper">
            <div class="card-item add-card" @click="addNew">
              <el-card class="box-card">
                <div class="card-content">
                  <div class="card-icon">
                    <i class="el-icon-circle-plus"></i>
                  </div>
                  <p>创建新的预约项目</p>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我参与的预约项目" name="second">hello world2</el-tab-pane>
        <el-tab-pane label="我拥有的分类" name="third">hello world3</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      addNew() {
        this.$router.push('/admin/new');
      }
    }
  }
</script>