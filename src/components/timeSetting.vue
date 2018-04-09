<template>
  <div class="form-settime-wrapper">
    <div class="form-item-desc">预约时间设置</div>
    <el-radio-group v-model="isShowNormal" class="setting-pattern">
      <el-radio-button :label="true">常规设置</el-radio-button>
      <el-radio-button :label="false">特殊设置</el-radio-button>
    </el-radio-group>
    <div class="normal-setting-wrapper" v-show="isShowNormal">
      <div class="normal-setting-item" v-for="(item, index) in formatedForm">
        <span>{{ item.time }}</span>
        <div @click="editItem(index)" class="weekday-container">
          <span v-for="day in item.weekday" class="weekday">{{ day }}</span>
        </div>
        <span v-if="item.limit < 10000" class="number">名额{{ item.limit }}人</span>
        <span v-else>名额不限制</span>
        <span class="operate-btn">
          <i class="el-icon-circle-plus-outline" @click="newItem"></i>
          <i class="el-icon-remove-outline" v-show="formatedForm.length > 1"
          @click="deleteItem(index)"></i>
        </span>
      </div>
      <el-dialog
        title="预约时间设置"
        :visible.sync="settingDialogVisible"
        width="600px"
        center
        @close="isEdit = false">
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
          <el-button type="primary" @click="confirmSetting">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
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
        isEdit: false,
        editIndex: null
      }
    },
    computed: {
      formatedForm() {
        var array = [];
        var newNormal = this.currentTimeState.normal.map(function(item) {
          item.weekday.forEach(function(value) {
            switch(value)
            {
              case 'Mon':
                array.push('周一');
                break;
              case 'Tues':
                array.push('周二');
                break;
              case 'Wed':
                array.push('周三');
                break;
              case 'Thur':
                array.push('周四');
                break;
              case 'Fri':
                array.push('周五');
                break;
              case 'Sat':
                array.push('周六');
                break;
              case 'Sun':
                array.push('周日');
                break;
              case 'Holiday':
                array.push('法定节假日');
                break;
              default:
                array.push(value);
            }
          })
          var newItem = {"time": item.time, "limit": item.limit, "weekday": array};
          array = [];
          return newItem;
        })
        return newNormal;
      }
    },
    methods: {
      isValueNumber (val) {
        return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(val+ '');
      },
      newItem() {
        this.settingDialogVisible = true;
        this.timeValue = '';
        this.weekdayValue = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
        this.limitValue = ' ';
      },
      confirmSetting() {
        var isError = false;
        var _this = this;
        var newItem = {};
        var limit;
        var time = '';
        var weekday = this.weekdayValue;
        if(this.limitValue === ' ' || this.limitValue === '') {
          limit = 65535
        } else {
          limit = Number(this.limitValue);
        }
        if(this.timeValue.length) {
          time = this.timeValue[0] + '-' + this.timeValue[1];
          newItem = {"time": time, "limit": limit, "weekday": weekday};
          if(!this.isEdit) {
            this.currentTimeState.normal.every(function(item) {
              if(item.time === time) {
                isError = true;
                return false
              }
              return true
            })
            if(!isError) {
              this.currentTimeState.normal.push(newItem);
              this.settingDialogVisible = false;
            } else {
              this.$message.error('已存在相同时间段')
            }
          } else {
            this.currentTimeState.normal.forEach(function(item, index) {
              if(index !== _this.editIndex && item.time === time) {
                isError = true;
              }
            })
            if(!isError) {
              this.currentTimeState.normal.splice(this.editIndex,1,newItem);
              this.settingDialogVisible = false;
            } else {
              this.$message.error('已存在相同时间段')
            }
          }
        } else {
          this.settingDialogVisible = true;
          this.$message.error('请填写时间段');
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
        this.limitValue = item.limit > 10000?' ':item.limit;
        this.isEdit = true;
        this.editIndex = index;
      }
    },
    watch: {
      timeState(val) {
        this.currentTimeState = val;
      },
      "currentTimeState": {
        handler: function(val) {
          this.$emit('on-change',val)
        },
        deep: true
      }
    }
  }
</script>