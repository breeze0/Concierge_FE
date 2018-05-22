<template>
  <div class="admin-com-container">
    <div class="tabs-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="预约项目" name="project">
          <div class="new-project" @click="newProject">
            <i class="el-icon-circle-plus"></i>
            <span class="new-project-text">创建新的预约项目</span>
          </div>
          <div class="card-wrapper">
            <project-entrance :project="project"
                              v-for="project in projectsList"
                              :key="project.id">
            </project-entrance>
          </div>
          <div class="pagination-wrapper" v-show="projectsList.length">
            <el-pagination
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-size="pageSize"
              :page-sizes="[4,8,12,16,20]"
              layout="total,sizes,prev, pager, next, jumper"
              :total="totalProjects">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分类" name="category">
          <el-button type="primary" class="new-group" @click="groupDialogVisible = true">创建新的分类</el-button>
          <el-dialog
            title="创建新的分类"
            :visible.sync="groupDialogVisible"
            width="600px">
            <el-form>
              <el-form-item>
                <el-input
                  placeholder="请输入分类名称"
                  v-model="group.name">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  placeholder="搜索预约项目名称"
                  prefix-icon="el-icon-search"
                  v-model="searchInput">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="projects-wrapper">
                  <el-checkbox-group
                    v-model="checkedProjects"
                    @change="handleCheckedProjectsChange"
                    class="projects-checkbox-group">
                    <el-checkbox
                      v-for="project in projects"
                      :label="project.id"
                      :key="project.id">{{project.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="groupDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="createGroup">确 定</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import projectEntrance from '@/components/project_entrance.vue'

  const ERROR_TIP = {
    name_error: '请输入分类名称',
    projects_empty: '请选择预约项目'
  }
  export default {
    components: {
      "project-entrance": projectEntrance
    },
    data() {
      return {
        activeName: 'project',
        projectsList:[],
        projects: [],
        checkedProjects: [],
        totalProjects: 0,
        pageSize: 12,
        groupDialogVisible: false,
        group: {
          name: '',
          projects: []
        },
        searchInput: ''
      };
    },
    methods: {
      newProject() {
        this.$router.push(this.GLOBAL.routers.projects_new);
      },
      goPage(page, size) {
        this.$http({
          method: 'get',
          url: this.GLOBAL.requestUrls.projects,
          headers: {
            'Authorization': this.getCookie('token')
          },
          params: {
            page: page,
            size: size
          }
        }).then(res => {
          this.projectsList = res.data.projects;
          this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
        }).catch(err=>{
        this.handleHttpError(err);
        })
      },
      handleCurrentChange(pageIndex) {
        this.goPage(pageIndex, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.goPage(1,pageSize);
      },
      handleCheckedProjectsChange() {
        console.log(this.checkedProjects)
      },
      createGroup() {
        if(this.group.name) {
          if(this.checkedProjects.length) {
            this.$http({
              method: 'post',
              url: this.GLOBAL.requestUrls.groups,
              headers: {
                'Authorization': this.getCookie('token')
              },
              data: {
                name: this.group.name,
                projects: this.checkedProjects
              }
            }).then(res => {
              console.log(res)
            })
          } else {
            this.$message.error(ERROR_TIP.projects_empty);
          }
        } else {
          this.$message.error(ERROR_TIP.name_error);
        }
      }
    },
    mounted() {
      this.$http.get(this.GLOBAL.requestUrls.projects, this.getRequestConfig()).then((res) => {
        this.projectsList = res.data.projects;
        this.totalProjects = res.data.count;
        this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
      }).catch(err=>{
        this.handleHttpError(err);
      });
      this.$http.get(this.GLOBAL.requestUrls.all_projects, this.getRequestConfig()).then(res => {
        this.projects = res.data.projects;
        this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
      })
    }
  }
</script>