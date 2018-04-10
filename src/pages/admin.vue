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
            <div class="card-item project" v-for="(project, index) in handledProject"
            @click="editProject(index)">
              <img :src="project.image" class="project-image">
              <span class="project-name">{{ project.name }}</span>
              <span class="project-state" v-if="project.state === 'open'">开启</span>
              <span class="project-state" v-else>关闭</span>
              <span class="project-share"><i class="el-icon-share"></i></span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分类" name="category"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
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
        this.$router.push('/admin/projects/new');
      },
      editProject(index) {
        this.$router.push('/admin/projects/'+ this.projectsList[index].id + '/edit');
      }
    },
    computed: {
      handledProject() {
        var _this = this;
        var newProject = this.projectsList.map(function(item) {
          var newItem = {"id": item.id,"name": item.name, "image": _this.server + item.image,"state": item.state};
          return newItem
        })
        return newProject
      }
    },

    mounted() {
      var url = this.server+'/projects';
      var config = {
        headers: {
          "Authorization": this.getCookie('token')
        }
      };
      this.$http.get(url,config).then((res) =>{
        this.projectsList = res.data.projects;
        this.setCookie('token',res.headers.authorization,this.expire);
      })
    }
  }
</script>