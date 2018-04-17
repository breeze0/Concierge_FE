<template>
  <div class="form-settime-wrapper">
    <div class="form-item-desc">预约时间设置</div>
    <el-radio-group v-model="isShowNormal" class="setting-pattern">
      <el-radio-button :label="true">常规设置</el-radio-button>
      <el-radio-button :label="false">特殊设置</el-radio-button>
    </el-radio-group>
    <div class="normal-setting-wrapper" v-show="isShowNormal">
      <div class="normal-setting-item"
           v-for="(item, index) in formatedTimeState">
        <span>{{ item.time }}</span>
        <div @click="editItem(index)" class="weekday-container">
          <span v-for="day in item.weekday" class="weekday">{{ day }}</span>
        </div>
        <span  v-if="item.limit === null">名额不限制</span>
        <span v-else class="number">名额{{ item.limit }}人</span>
        <span class="operate-btn">
          <i class="el-icon-circle-plus-outline" @click="newItem"></i>
          <i class="el-icon-remove-outline" v-show="formatedTimeState.length > 1"
          @click="deleteItem(index)"></i>
        </span>
      </div>
      <el-dialog
        title="预约时间设置"
        :visible.sync="settingDialogVisible"
        width="600px"
        center
        @close="editStatus = false">
        <div class="setting-content">
          <div class="fields">
            <span class="text">时间段: </span>
            <el-time-picker
              is-range
              v-model="timeValue"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              format="HH:mm"
              value-format="HH:mm"
              class="time-input">
            </el-time-picker>
          </div>
          <div class="fields">
            <span class="text">重复:</span>
            <el-select v-model="weekdayValue" multiple placeholder="请选择">
              <el-option
                v-for="item in weekdays"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="fields">
            <span class="text">名额限制: </span>
            <el-input v-model="limitValue" class="count-input" placeholder="不填写则默认为无限制" type="number" ></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="settingDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="compeleteSetting">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  const WEEKDAY_MAP = {
    'Mon': '周一',
    'Tues': '周二',
    'Wed': '周三',
    'Thur': '周四',
    'Fri': '周五',
    'Sat': '周六',
    'Sun': '周日',
    'Holiday': '法定节假日'
  }
  export default {
    props: {
      timeState: {
        type: Object,
        default: {
          "normal": [
           {"time": '09:00-10:00', "limit": 10, "weekday": ['Mon','Tues','Wed','Thur','Fri']}
          ],
          "special": []
        }
      }
    },
    data() {
      return {
        weekdays: [
          {
            value: 'Mon',
            label: '周一'
          },
          {
            value: 'Tues',
            label: '周二'
          },
          {
            value: 'Wed',
            label: '周三'
          },
          {
            value: 'Thur',
            label: '周四'
          },
          {
            value: 'Fri',
            label: '周五'
          },
          {
            value: 'Sat',
            label: '周六'
          },
          {
            value: 'Sun',
            label: '周日'
          },
          {
            value: 'Holiday',
            label: '法定节假日'
          }
        ],
        currentTimeState: this.timeState,
        settingDialogVisible: false,
        isShowNormal: true,
        timeValue: '',
        weekdayValue: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'],
        limitValue: '',
        editStatus: false,
        editIndex: null
      }
    },
    computed: {
      formatedTimeState() {
        var new_normal = this.currentTimeState.normal.map(function(item) {
          var new_weekday = item.weekday.map(function(weekday) {
            return WEEKDAY_MAP[weekday];
          })
          return  {"time": item.time, "limit": item.limit, "weekday": new_weekday};
        })
        return new_normal;
      }
    },
    methods: {
      newItem() {
        this.settingDialogVisible = true;
        this.timeValue = '';
        this.weekdayValue = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
        this.limitValue = ' ';
      },
      validateEmpty() {
        this.error = {};
        if(!(this.timeValue.length && this.weekdayValue.length)) {
          this.error.empty_tip = '请填写时间段和重复日期';
        }
        return Object.keys(this.error).length == 0
      },
      validateNewTime(time) {
        this.error = {};
        this.currentTimeState.normal.forEach(item => {
          if(item.time == time) {
            this.error.new_repeat_tip = '已存在相同时间段';
          }
        });
        return Object.keys(this.error).length == 0
      },
      validateEditTime(time) {
        this.error = {};
        this.currentTimeState.normal.forEach((item, index) => {
          if(index !== this.editIndex && item.time === time) {
            this.error.edit_repeat_tip = '已存在相同时间段';
          }
        });
        return Object.keys(this.error).length == 0
      },
      compeleteSetting() {
        var new_item = {};
        var limit;
        var time = '';
        var weekday = this.weekdayValue;
        if(this.limitValue === ' ' || this.limitValue === '') {
          limit = null
        } else {
          limit = Math.abs(parseInt(this.limitValue));
        }
        if(this.validateEmpty()) {
          time = this.timeValue[0] + '-' + this.timeValue[1];
          new_item = {"time": time, "limit": limit, "weekday": weekday};
          if(!this.editStatus) {
            if(this.validateNewTime(time)) {
              this.currentTimeState.normal.push(new_item);
              this.settingDialogVisible = false;
            } else {
              this.$message.error(this.error.new_repeat_tip);
            }
          } else {
            if(this.validateEditTime(time)) {
              this.currentTimeState.normal.splice(this.editIndex,1,new_item);
              this.settingDialogVisible = false;
            } else {
              this.$message.error(this.error.edit_repeat_tip);
            }
          }
        } else {
          this.settingDialogVisible = true;
          this.$message.error(this.error.empty_tip);
        }
      },
      deleteItem(index) {
        this.currentTimeState.normal.splice(index,1);
      },
      editItem(index) {
        this.settingDialogVisible = true;
        var item = this.currentTimeState.normal[index];
        this.timeValue = item.time.split('-');
        this.weekdayValue = item.weekday;
        this.limitValue = item.limit === null?' ':item.limit;
        this.editStatus = true;
        this.editIndex = index;
      },
      updateValue(val) {
        this.currentTimeState = val
      },
      getData() {
        return this.currentTimeState
      }
    }
  }
</script>