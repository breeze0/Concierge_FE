<template>
  <div class="admin-com-container">
    <div class="admin-com-top">
        <div class="created-search-space-between">
          <el-dropdown
            split-button
            type="primary"
            trigger="click"
            @click="newProject"
            @command="handleDropdownCommand">
            <span class="new-project-text">创建新项目</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="newProject">创建新项目</el-dropdown-item>
              <el-dropdown-item command="newGroup">创建新分类</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-input
            placeholder="搜索预约项目名称"
            prefix-icon="el-icon-search"
            v-model="searchContent"
            class="search-input">
          </el-input>
        </div>
        <div class="group-display" :class="{display: groupShowAll, hidden: !groupShowAll}">
          <span class="control-icon" @click="changeDisplay">
            <i class="el-icon-arrow-right" v-if="!groupShowAll"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </span>
          <div class="group-item title">分类:</div>
          <div class="group-item" v-for="(group, index) in groupsList">
            <span :class="[checkedGroupIndex === index ? 'active':'', 'group-name']"
                  @click="changeClass(index)">{{ group.name }}</span>
            <span class="group-count">{{ group.count }}</span>
          </div>
        </div>
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
    </div>
    <div class="admin-com-bottom">
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
        projectsList:[],
        projects: [],
        groupsList: [
          {name: '全部', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10},
          {name: '成华区图书馆', count: 10}
        ],
        checkedGroupIndex: 0,
        checkedProjects: [],
        totalProjects: 0,
        pageSize: 12,
        groupDialogVisible: false,
        groupShowAll: false,
        group: {
          name: '',
          projects: []
        },
        searchContent: ''
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
      handleDropdownCommand(command) {
        if(command === 'newProject') this.newProject();
        else if(command === 'newGroup') this.groupDialogVisible = true;
        else return;
      },
      changeClass(index) {
        this.checkedGroupIndex = index;
      },
      changeDisplay() {
        this.groupShowAll = !this.groupShowAll;
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