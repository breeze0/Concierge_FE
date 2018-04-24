<template>
  <div class="detail-com-container">
    <div class="return-to-prev">
      <router-link to="/admin/projects"><i class="el-icon-back"></i></router-link>
      <span class="reservation-name">{{ this.$route.params.projectName }}预约记录</span>
      <span class="project-state">开启预约</span>
      <el-switch
        v-model="projectState"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
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
            <span class="operate-set">核销</span>
            <span class="operate-set" @click="cancel(index,item.state)">取消</span>
          </span>
          <span class="operate item" v-else-if="item.state === '待审核'">
            <span class="operate-set">通过</span>
            <span class="operate-set" @click='cancel(index,item.state)'>拒绝</span>
          </span>
          <span class="operate item" v-else>---</span>
        </div>
        <el-dialog
          :title="modalTitle"
          :visible.sync="dialogVisible"
          width="500px">
          <el-input
            class="border-bottom"
            v-model="operateRemark"
            placeholder="请输入处理意见">  
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  const OPTIONS = [
    {value: '', label: '全部'},
    {value: 'wait', label: '待审核'},
    {value: 'success', label: '已成功'},
    {value: 'refused', label: '已拒绝'},
    {value: 'cancelled', label: '已取消'},
    {value: 'checked', label: '已核销'},
    {value: 'overtime', label: '已过期'}
  ];
  const STATE_MAP = {
    success: '已成功',
    wait: '待审核',
    refused: '已拒绝',
    cancelled: '已取消',
    checked: '已核销',
    overtime: '已过期'
  };
  const MODAL_TITLE = {
    '已成功': '取消预约',
    '待审核': '拒绝预约'
  };
  export default {
    data() {
      return  {
        reservations: [],
        projectName: '',
        projectState: '',
        reservationsDate: [],
        reservationsTel: '',
        reservationsState: '',
        reservationsStateOptions: OPTIONS,
        dialogVisible: false,
        modalTitle: '',
        operateRemark: ''
      }
    },
    computed: {
      formatedReservations() {
        var new_reservations = this.reservations.map(item => {
          item.state = STATE_MAP[item.state];
          return item;
        });
        return new_reservations;
      }
    },
    created() {
      this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations',this.getRequestConfig()).then(res => {
        this.reservations = res.data.reservations
      })
    },
    methods: {
      search() {
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
            page: 1
          }
        }).then(res => {
          this.reservations = res.data.reservations
        })
      },
      cancel(index, state) {
        this.reservationsIndex = index;
        this.modalTitle = MODAL_TITLE[state];
        this.dialogVisible = true;
      },
      confirm() {
        if(this.modalTitle === '取消预约') {
          // this.$http({
          //   method: 'post',
          //   url: this.GLOBAL.requestUrls.project + this.$route.params.id + '/reservations/' + this.reservations[this.reservationsIndex].id + '/cancel',
          //   headers: {
          //     'Authorization': this.getCookie('token')
          //   },
          //   data: {
          //     remark: this.operateRemark
          //   }
          // }).then(res => {
          //   this.reservations[this.reservationsIndex].state = STATE_MAP['cancelled'];
          //   this.reservations[this.reservationsIndex].remark = this.operateRemark;
          //   this.dialogVisible = false;
          // })
          this.reservations[this.reservationsIndex].state = STATE_MAP['cancelled'];
          this.reservations[this.reservationsIndex].remark = this.operateRemark;
          this.dialogVisible = false;
        }
      }
    }
  }
</script>