<template>
  <div class="admin-com-container">
    <div class="tabs-wrapper">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预约项目" name="project">
          <div class="card-wrapper">
            <div class="card-item add-card" @click="newProject">
              <el-card class="box-card">
                <div class="card-content">
                  <div class="card-icon">
                    <i class="el-icon-circle-plus"></i>
                  </div>
                  <p>创建新的预约项目</p>
                </div>
              </el-card>
            </div>
            <div class="card-item project"
                 v-for="project in projectsList">
              <project-entrance :project="project"></project-entrance>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分类" name="category"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import projectEntrance from '@/components/project_entrance.vue'
  export default {
    components: {
      "project-entrance": projectEntrance
    },
    data() {
      return {
        activeName: 'project',
        projectsList:[]
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      newProject() {
        this.$router.push(this.GLOBAL.routers.projects_new);
      }
    },
    mounted() {
      this.$http.get(this.GLOBAL.requestUrls.projects, this.getRequestConfig()).then((res) =>{
        this.projectsList = res.data.projects;
        this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
      }).catch(err=>{
        this.handleHttpError(err);
      })
    }
  }
</script>