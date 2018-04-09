<template>
  <div class="form-com-container">
    <div class="return_to_prev">
      <router-link to="/admin/projects"><i class="el-icon-back"></i></router-link>
      <span v-if="this.$route.params.id">修改预约项目</span>
      <span v-else>创建新的预约项目</span>
    </div>
    <div class="form-wrapper">
      <el-form ref="form" :model="form">
        <el-form-item>
          <selectImg :image="form.image"
                     @on-change="setCover"></selectImg>
        </el-form-item>
        <el-form-item>
          <div class="title-wrapper">
            <el-input v-model="form.name" placeholder="请输入预约项目名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="desc-wrapper">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="预约详情介绍或预约注意事项"
              v-model="form.des">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <addressPicker :address="form.address"
                         :latitude="form.latitude"
                         :longtitude="form.longtitude"
                         @on-change="setAddress"></addressPicker>
        </el-form-item>
        <el-form-item>
          <div class="form-check">
            <span class="check-text">审核模式: </span>
            <el-radio v-model="form.check_mode" label="auto">自动审核</el-radio>
            <el-radio v-model="form.check_mode" label="manual">人工审核</el-radio>
          </div>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>
      </el-form>
      <div class="form-btn">
        <el-button>
          <router-link to="/admin/projects">取消</router-link>
        </el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import selectImg from '@/components/selectImg'
  import addressPicker from '@/components/map'
  export default {
    components: {
      selectImg,
      addressPicker
    },

    data() {
      return {
        form: {
          image: '',
          name: '',
          des: '',
          address: '',
          latitude: 0,
          longtitude: 0,
          check_mode: 'auto',
          time_state: {
            normal: [
             {time: '09:00-10:00', limit: 10, weekday: ['Mon','Tues','Wed','Thur','Fri']}
            ],
            special: []
          }
        },
        weekdays: [{
          value: 'Mon',
          label: '周一'
        }, {
          value: 'Tues',
          label: '周二'
        }, {
          value: 'Wed',
          label: '周三'
        }, {
          value: 'Thur',
          label: '周四'
        }, {
          value: 'Fri',
          label: '周五'
        }, {
          value: 'Sat',
          label: '周六'
        }, {
          value: 'Sun',
          label: '周日'
        }, {
          value: 'Holiday',
          label: '法定节假日'
        }],
        settingDialogVisible: false,
        isShowNormal: true,
        timeValue: '',
        weekdayValue: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'],
        limitValue: '',
        isEdit: false,
        editIndex: null,
        imgFile: {}
      } 
    },

    computed: {
      formatedForm() {
        var array = [];
        var newNormal = this.form.time_state.normal.map(function(item) {
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
    created() {
      if(this.$route.params.id) {
        this.openFullScreen();
        var url = this.server + '/projects/' + this.$route.params.id;
        var config = {
          headers: {
            'Authorization': this.getCookie('token')
          }
        }
        this.$http.get(url, config).then((res)=> {
          this.form = res.data;
        })
      }
    },
    methods: {
      openFullScreen() {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: '#f1f1f1',
          customClass: 'loading-style'
        });
        setTimeout(() => {
          loading.close();
        }, 1500);
      },
      setCover(args) {
        this.form.image = args.image;
      },
      setAddress(args) {
        this.form.address = args.address;
        this.form.longtitude = args.longtitude;
        this.form.latitude = args.latitude;
      },
      newItem() {
        this.settingDialogVisible = true;
        this.timeValue = '';
        this.weekdayValue = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
        this.limitValue = '';
      },
      confirmSetting() {
        var isError = false;
        var _this = this;
        var newItem = {};
        var limit;
        var time = '';
        var weekday = this.weekdayValue;
        if(this.limitValue === '') {
          limit = 65535
        } else {
          limit = Number(this.limitValue);
        }
        if(this.timeValue.length) {
          time = this.timeValue[0] + '-' + this.timeValue[1];
          newItem = {"time": time, "limit": limit, "weekday": weekday};
          if(!this.isEdit) {
            this.form.time_state.normal.every(function(item) {
              if(item.time === time) {
                isError = true;
                return false
              }
              return true
            })
            if(!isError) {
              this.form.time_state.normal.push(newItem);
              this.settingDialogVisible = false;
            } else {
              this.$message.error('已存在相同时间段')
            }
          } else {
            this.form.time_state.normal.forEach(function(item, index) {
              if(index !== _this.editIndex && item.time === time) {
                isError = true;
              }
            })
            if(!isError) {
              this.form.time_state.normal.splice(this.editIndex,1,newItem);
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
        this.form.time_state.normal.splice(index,1);
      },
      editItem(index) {
        this.settingDialogVisible = true;
        var item = this.form.time_state.normal[index];
        this.timeValue = item.time.split('-');
        this.weekdayValue = item.weekday;
        this.limitValue = item.limit > 10000?'':item.limit;
        this.isEdit = true;
        this.editIndex = index;
      },

      submitForm() {
        var formData = new FormData();
        formData.append('name',this.form.name);
        formData.append('description', this.form.des);
        formData.append('address', this.form.address);
        formData.append('latitude', this.form.latitude);
        formData.append('longtitude', this.form.longtitude);
        formData.append('time_state', JSON.stringify(this.form.time_state));
        formData.append('check_mode', this.form.check_mode);
        formData.append('image', this.form.image)
        var config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': this.getCookie('token')
          }
        }
        if(this.form.name) {
          if(this.$route.params.id) {
            this.$http.put(this.server + '/projects/' + this.$route.params.id, formData, config).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.expire);
              this.$router.push('/admin/projects');
            })
          } else {
            this.$http.post(this.server+'/projects',formData,config).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.expire);
              this.$router.push('/admin/projects');
            })
          }
        } else {
          this.$message.error('预约项目名称不能为空')
        }
      }
    }
  }
</script>