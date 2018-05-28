<template>
  <div class="admin-com-container">
    <div class="admin-com-top">
        <div class="created-search-space-between">
          <el-dropdown
            split-button
            type="primary"
            trigger="click"
            @click="newProject"
            @command="handleDropdownCommand"
            v-if="!searchState">
            <span class="new-project-text">创建新项目</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="newProject">创建新项目</el-dropdown-item>
              <el-dropdown-item command="newGroup">创建新分类</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="search-result-text" v-else>搜索结果</span>
          <el-input
            clearable
            placeholder="搜索预约项目名称"
            prefix-icon="el-icon-search"
            v-model="searchContent"
            class="search-input"
            @keyup.native.enter="handleSearch"
            @clear="handleClear">
          </el-input>
        </div>
        <div class="group-display"
             v-show="!searchState"
             :class="{display: groupShowAll, hidden: !groupShowAll}">
          <span class="control-icon" @click="changeDisplay">
            <i class="el-icon-arrow-right" v-if="!groupShowAll"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </span>
          <div class="title"><span class="group-title">分类:</span></div>
          <div class="group-item" v-for="(item, index) in groupsList">
            <span :class="[checkedGroupIndex === index ? 'active':'', 'group-name']"
                  @click="changeGroup(index)">{{ item.name }}</span>
            <span class="group-count">{{ item.total }}</span>
          </div>
        </div>
        <el-dialog
          :title="groupEditState?'修改分类':'创建新分类'"
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
                  v-model="group.projects"
                  class="projects-checkbox-group">
                  <el-checkbox
                    v-for="project in allProjects"
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
      <div class="group-wrapper" v-show="checkedGroupId !== 0">
        <span class="group-name">{{ checkedGroupName }}</span>
        <span class="group-operate-btn">
          <i class="el-icon-edit" @click="editGroup"></i>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-share"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdown-container">
              <div class="text">
                <span class="icon" style="background-image: url('./static/images/wechat.png');"></span>
                <span>微信扫一扫</span>
              </div>
              <formated-image
                :originUrl="checkedGroupWxcode"
                class="code-wrapper"
                :className="codeClass">
              </formated-image>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-delete"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdown-delete-container">
              <div class="title">删除分类</div>
              <div class="content-item">您确定要删除"{{ checkedGroupName }}"分类吗?</div>
              <div class="content-item">1、删除分类后该分类将不在分类列表中显示。</div>
              <div class="content-item">2、添加了该分类的所有预约项目都将搜索不到该分类。</div>
              <div class="content-item">请谨慎对待!</div>
             <el-dropdown-item>
              <el-button type="primary" @click="deleteGroup">确 定</el-button>
             </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
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
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[4,8,12,16,20]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="paginationCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import formatedImage from '@/components/formated_image.vue'
  import projectEntrance from '@/components/project_entrance.vue'

  const ERROR_TIP = {
    name_error: '请输入分类名称',
    projects_empty: '请选择预约项目'
  }
  export default {
    components: {
      "project-entrance": projectEntrance,
      "formated-image": formatedImage
    },
    data() {
      return {
        projectsList:[],
        allProjects: [],
        groupsList: [],
        checkedGroupName: '',
        checkedGroupId: 0,
        checkedGroupIndex: 0,
        checkedGroupWxcode: '',
        paginationCount: 0,
        pageSize: 12,
        currentPage: 1,
        groupDialogVisible: false,
        groupShowAll: false,
        groupEditState: false,
        searchState: false,
        codeClass: 'code',
        group: {
          name: '',
          projects: []
        },
        searchContent: ''
      };
    },
    created() {
      this.requestAllProjects();
      this.requestProjects();
    },
    methods: {
      newProject() {
        this.$router.push(this.GLOBAL.routers.projects_new);
      },
      handleDropdownCommand(command) {
        if(command === 'newProject') this.newProject();
        else if(command === 'newGroup') {
          this.group.name = '';
          this.group.projects = [];
          this.groupDialogVisible = true;
        }
        else return;
      },
      handleSearch() {
        this.checkedGroupId = 0;
        this.checkedGroupIndex = 0;
        this.searchState = true;
        this.searchParam = this.searchContent;
        if(this.searchContent) {
          this.goPage(1, this.pageSize, this.checkedGroupId, this.searchParam);
        } else {
          this.handleClear();
        }
      },
      handleClear() {
        this.searchState = false;
        this.searchParam = this.searchContent;
        this.changeGroup(0);
      },
      refreshGroup() {
        this.$http({
          method: 'get',
          url: this.GLOBAL.requestUrls.projects,
          headers: {
            'Authorization': this.getCookie('token')
          },
          params: {
            group: this.checkedGroupId === 0?'':this.checkedGroupId,
            size: this.pageSize,
          }
        }).then(res => {
          this.projectsList = res.data.projects;
          this.paginationCount = res.data.count;
          this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
        })
      },
      getGroupInfo() {
        this.$http.get(this.GLOBAL.requestUrls.group + (this.checkedGroupId === 0?'':this.checkedGroupId), this.getRequestConfig()).then(res => {
          this.editGroupName = res.data.name;
          this.editGroupProjects = res.data.projects;
        })
      },
      changeGroup(index) {
        this.checkedGroupIndex = index;
        this.checkedGroupId = this.groupsList[index].id;
        this.checkedGroupName = this.groupsList[index].name;
        this.checkedGroupWxcode = this.groupsList[index].wxcode;
        this.currentPage = 1;
        this.refreshGroup();
        this.getGroupInfo();
      },
      changeDisplay() {
        this.groupShowAll = !this.groupShowAll;
      },
      handleCurrentChange(pageIndex) {
        this.goPage(pageIndex, this.pageSize, this.checkedGroupId, this.searchParam);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.goPage(1, pageSize, this.checkedGroupId, this.searchParam);
      },
      goPage(page, size, id, search) {
        this.$http({
          method: 'get',
          url: this.GLOBAL.requestUrls.projects,
          headers: {
            'Authorization': this.getCookie('token')
          },
          params: {
            page: page,
            size: size,
            group: id === 0?'':id,
            search: search
          }
        }).then(res => {
          this.projectsList = res.data.projects;
          this.paginationCount = res.data.count;
          this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
        }).catch(err=>{
        this.handleHttpError(err);
        })
      },
      requestCreateGroup() {
        this.$http({
          method: 'post',
          url: this.GLOBAL.requestUrls.groups,
          headers: {
            'Authorization': this.getCookie('token')
          },
          data: {
            name: this.group.name,
            projects: this.group.projects
          }
        }).then(res => {
          this.requestGroups();
        })
      },
      requestEditGroup() {
        this.$http({
          method: 'put',
          url: this.GLOBAL.requestUrls.group + this.checkedGroupId,
          headers: {
            'Authorization': this.getCookie('token')
          },
          data: {
            name: this.group.name,
            projects: this.group.projects
          }
        }).then(res => {
          this.requestGroups();
          this.refreshGroup();
          this.getGroupInfo();
        })
      },
      createGroup() {
        if(this.group.name) {
          if(this.group.projects.length) {
            if(this.groupEditState) {
              this.requestEditGroup();
            } else {
              this.requestCreateGroup();
            }
          } else {
            this.$message.error(ERROR_TIP.projects_empty);
          }
        } else {
          this.$message.error(ERROR_TIP.name_error);
        }
      },
      editGroup() {
        this.groupEditState = true;
        this.group.name = this.editGroupName;
        this.group.projects = this.editGroupProjects;
        this.groupDialogVisible = true;
      },
      deleteGroup() {
        this.$http({
          method: 'delete',
          url: this.GLOBAL.requestUrls.group + this.checkedGroupId,
          headers: {
            'Authorization': this.getCookie('token')
          }
        }).then(res => {
          this.requestGroups();
          this.changeGroup(0);
          this.deleteDialogVisible = false;
        })
      },
      requestProjects() {
        this.$http.get(this.GLOBAL.requestUrls.projects, this.getRequestConfig()).then((res) => {
          this.projectsList = res.data.projects;
          this.paginationCount = res.data.count;
          this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
        }).catch(err=>{
          this.handleHttpError(err);
        });
      },
      requestAllProjects() {
        this.$http.get(this.GLOBAL.requestUrls.all_projects, this.getRequestConfig()).then(res => {
          this.groupFirstData = {
            id: 0,
            name: '全部',
            total: res.data.projects.length,
            wxcode: ''
          }
          this.allProjects = res.data.projects;
          this.groupsList.push(this.groupFirstData);
          this.requestGroups();
          this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
        })
      },
      requestGroups() {
        this.$http.get(this.GLOBAL.requestUrls.groups,this.getRequestConfig()).then(res => {
          this.groupsList = [];
          this.groupsList.push(this.groupFirstData);
          this.groupsList = this.groupsList.concat(res.data);
          this.checkedGroupName = this.groupsList[this.checkedGroupIndex].name;
          this.groupDialogVisible = false;
        })
      }
    }
  }
</script>