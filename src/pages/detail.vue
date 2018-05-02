<template>
  <div class="detail-com-container">
    <div class="return-to-prev">
      <router-link to="/admin/projects"><i class="el-icon-back"></i></router-link>
      <span class="reservation-name">{{ this.$route.params.projectName }}预约记录</span>
      <span class="project-state">开启预约</span>
      <el-switch
        v-model="projectState"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="changeState">
      </el-switch>
      <el-dialog
        title="确认关闭"
        :visible.sync="stateDialogVisible"
        width="500px">
        <span>关闭项目后，该项目下的所有预约都会被自动取消，您确认要关闭么?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="stateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="closeProject">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="reservations-list">
      <div class="reservations-search">
        <el-date-picker
          class="date-picker"
          v-model="reservationsDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <div class="reservations-tel">
          <span>联系电话: </span>
          <el-input v-model="reservationsTel" class="tel-input"></el-input>
        </div>
        <div class="reservations-state">
          <span>预约状态: </span>
          <el-select v-model="reservationsState" class="state-select">
            <el-option
              v-for="item in reservationsStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" class="search-btn" @click="search">查询</el-button>
      </div>
      <div class="reservations-list-body">
        <div class="list-wrapper">
          <div class="table-item table-head">
            <span class="item">姓名</span>
            <span class="item">预约状态</span>
            <span class="item">联系电话</span>
            <span class="item">预约时间</span>
            <span class="item">预约时间段</span>
            <span class="remark item">备注</span>
            <span class="operate item">操作</span>
          </div>
          <div class="table-item"
               v-for="(item, index) in formatedReservations"
               :key="item.id">
            <span class="item">{{ item.name }}</span>
            <span class="item">{{ item.state }}</span>
            <span class="item">{{ item.tel }}</span>
            <span class="item">{{ item.date }}</span>
            <span class="item">{{ item.time }}</span>
            <span class="remark item">{{ item.remark }}</span>
            <span class="operate item" v-if="item.state === '已成功'">
              <span class="operate-set" @click="allow(index, item.state)">核销</span>
              <span class="operate-set" @click="dismiss(index,item.state)">取消</span>
            </span>
            <span class="operate item" v-else-if="item.state === '待审核'">
              <span class="operate-set" @click="allow(index, item.state)">通过</span>
              <span class="operate-set" @click='dismiss(index,item.state)'>取消</span>
            </span>
            <span class="operate item" v-else>---</span>
          </div>
        </div>
        <el-dialog
          :title="modalTitle"
          :visible.sync="processDialogVisible"
          width="500px"
          ref='modalRef'>
          <el-input
            class="border-bottom"
            v-model="operateRemark"
            placeholder="请输入处理意见"
            v-if="modalTitle === '取消预约'">
          </el-input>
          <span v-else-if="modalTitle === '核销预约'">是否核销该预约?</span>
          <span v-else>是否通过该预约?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="processDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-dialog>
        <div class="reservations-list-bottom">
          <div class="state-count">
            <span>总计: {{ stateCountObj.total }}</span>
            <span>待审核: {{ stateCountObj.wait }}</span>
            <span>已成功: {{ stateCountObj.success }}</span>
            <span>已核销: {{ stateCountObj.checked }}</span>
            <span>已拒绝: {{ stateCountObj.refused }}</span>
            <span>已取消: {{ stateCountObj.cancelled }}</span>
            <span>已过期: {{ stateCountObj.overtime }}</span>
          </div>
          <div class="pagination-wrapper" v-show="reservations.length">
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="totalReservations">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const STATE_MAP = {
    success: '已成功',
    wait: '待审核',
    cancelled: '已取消',
    checked: '已核销',
    overtime: '已过期'
  };
  const OPTIONS = [
    {value: '', label: '全部'},
    {value: 'wait', label: STATE_MAP['wait']},
    {value: 'success', label: STATE_MAP['success']},
    {value: 'cancelled', label: STATE_MAP['cancelled']},
    {value: 'checked', label: STATE_MAP['checked']},
    {value: 'overtime', label: STATE_MAP['overtime']}
  ];
  const STRING_MAP = {
    cancel: '取消预约',
    check: '核销预约',
    pass: '通过预约',
    loading: '拼命加载中'
  }
  const DISMISS_MODAL_TITLE = {
    '已成功': STRING_MAP['cancel'],
    '待审核': STRING_MAP['cancel']
  };
  const ALLOW_MODAL_TITLE = {
    '已成功': STRING_MAP['check'],
    '待审核': STRING_MAP['pass']
  }
  export default {
    data() {
      return  {
        reservations: [],
        totalReservations: 0,
        projectState: '',
        reservationsDate: [],
        reservationsTel: '',
        reservationsState: '',
        reservationsStateOptions: OPTIONS,
        processDialogVisible: false,
        stateDialogVisible: false,
        modalTitle: '',
        operateRemark: '',
        stateCountObj: {}
      }
    },
    computed: {
      formatedReservations() {
        var new_reservations = this.reservations.map(item => {
          if(STATE_MAP[item.state]) {
            item.state = STATE_MAP[item.state];
          }
          return item;
        });
        return new_reservations;
      }
    },
    created() {
      const loading = this.$loading({
        text: STRING_MAP.loading,
        spinner: 'el-icon-loading',
        background: '#f1f1f1',
        customClass: 'loading-style'
      });
      this.getProjectState(loading);
      this.getReservations();
      this.getStateCount();
    },
    methods: {
      search() {
        this.filter(1);
      },
      filter(pageIndex) {
        this.$http({
          method: 'get',
          url: this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations',
          headers: {
            'Authorization': this.getCookie('token')
          },
          params: {
            tel: this.reservationsTel,
            date_to: (this.reservationsDate.length)?this.reservationsDate[1]:'',
            date_from: (this.reservationsDate.length)?this.reservationsDate[0]:'',
            state: this.reservationsState,
            page: pageIndex
          }
        }).then(res => {
          this.reservations = res.data.reservations;
          this.totalReservations = res.data.count;
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        })
      },
      dismiss(index, state) {
        this.reservationsIndex = index;
        this.modalTitle = DISMISS_MODAL_TITLE[state];
        this.processDialogVisible = true;
      },
      allow(index, state) {
        this.reservationsIndex = index;
        this.modalTitle = ALLOW_MODAL_TITLE[state];
        this.processDialogVisible = true;
      },
      handleAllow(urlParam, newState) {
        this.$http({
          method: 'post',
          url: this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations/' + this.reservations[this.reservationsIndex].id + urlParam,
          headers: {
            'Authorization': this.getCookie('token')
          }
        }).then(res => {
          this.reservations[this.reservationsIndex].state = STATE_MAP[newState];
          this.getStateCount();
          this.processDialogVisible = false;
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        })
      },
      handleDismiss(urlParam, newState) {
        this.$http({
          method: 'post',
          url: this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations/' + this.reservations[this.reservationsIndex].id + urlParam,
          headers: {
            'Authorization': this.getCookie('token')
          },
          data: {
            remark: this.operateRemark
          }
        }).then(res => {
          this.reservations[this.reservationsIndex].state = STATE_MAP[newState];
          this.reservations[this.reservationsIndex].remark = this.operateRemark;
          this.getStateCount();
          this.processDialogVisible = false;
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        })
      },
      confirm() {
        if(this.modalTitle === STRING_MAP['cancel']) {
          this.handleDismiss('/cancel', 'cancelled');
        } else if(this.modalTitle === STRING_MAP['check']) {
          this.handleAllow('/check', 'checked');
        } else if(this.modalTitle === STRING_MAP['pass']) {
          this.handleAllow('/pass', 'success')
        }
      },
      handleCurrentChange(pageIndex) {
        this.filter(pageIndex);
      },
      changeState(newState) {
        if(!newState) {
          this.projectState = true;
          this.stateDialogVisible = true;
        } else {
          this.openProject();
        }
      },
      closeProject() {
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id + '/pause', this.getRequestConfig()).then(res => {
          this.getReservations();
          this.getStateCount();
          this.projectState = false;
          this.stateDialogVisible = false;
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        });
      },
      openProject() {
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id + '/open', this.getRequestConfig()).then(res => {
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        });

      },
      getStateCount() {
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations/count', this.getRequestConfig()).then(res => {
          this.stateCountObj = res.data;
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        });
      },
      getReservations() {
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations',this.getRequestConfig()).then(res => {
          this.reservations = res.data.reservations;
          this.totalReservations = res.data.count;
        }).catch(err => {
          if(err.response.status === 401) {
           this.delCookie('token');
           this.$router.push(this.GLOBAL.routers.login);
          }
        });
      },
      getProjectState(loading) {
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id, this.getRequestConfig()).then(res => {
          if(res.data.state === 'open') {
            this.projectState = true;
          } else {
            this.projectState = false;
          }
          loading.close()
        })
      }
    }
  }
</script>