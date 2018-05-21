<template>
  <div class="admin-com-container">
    <div class="tabs-wrapper">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预约项目" name="project">
          <div class="new-project" @click="newProject">
            <i class="el-icon-circle-plus"></i>
            <span class="new-project-text">创建新的预约项目</span>
          </div>
          <div class="card-wrapper">
            <div class="card-item project"
                 v-for="project in projectsList">
              <project-entrance :project="project"></project-entrance>
            </div>
          </div>
          <div class="pagination-wrapper" v-show="projectsList.length">
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="4"
              layout="prev, pager, next, jumper"
              :total="totalProjects">
            </el-pagination>
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
        projectsList:[],
        totalProjects: 0
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      newProject() {
        this.$router.push(this.GLOBAL.routers.projects_new);
      },
      handleCurrentChange(pageIndex) {
        console.log(pageIndex)
      }
    },
    mounted() {
      this.$http.get(this.GLOBAL.requestUrls.projects, this.getRequestConfig()).then((res) =>{
        this.projectsList = res.data.projects;
        this.totalProjects = res.data.count;
        this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
      }).catch(err=>{
        this.handleHttpError(err);
      })
    }
  }
</script>