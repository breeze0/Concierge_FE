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
                 v-for="(project, index) in projectsList"
                 @click="showDetail(index)">
              <formated-image :originUrl="project.image" :className="imageClass" class="image-wrapper"></formated-image>
              <span class="project-name">{{ project.name }}</span>
              <span class="project-state" v-if="project.state === 'open'">开启</span>
              <span class="project-state" v-else>关闭</span>
              <span class="project-share">
                <i class="el-icon-edit" @click.stop="editProject(index)"></i>
                <i class="el-icon-share"></i>
              </span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分类" name="category"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import formatedImage from '@/components/formated_image.vue'
  export default {
    components: {
      "formated-image": formatedImage
    },
    data() {
      return {
        activeName: 'project',
        projectsList:[],
        imageClass: 'project-image'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      newProject() {
        this.$router.push(this.GLOBAL.routers.projects_new);
      },
      editProject(index) {
        this.$router.push(this.GLOBAL.routers.projects_edit + this.projectsList[index].id);
      },
      showDetail(index) {
        this.$router.push(this.GLOBAL.routers.reservations_details + this.projectsList[index].id)
      }
    },
    mounted() {
      this.$http.get(this.GLOBAL.requestUrls.projects, this.getRequestConfig()).then((res) =>{
        this.projectsList = res.data.projects;
        this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
      }).catch(err=>{
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
         }
       })
    }
  }
</script>