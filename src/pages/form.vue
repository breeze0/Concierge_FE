<template>
  <div class="form-com-container">
    <div class="form-wrapper">
      <div class="return-to-prev">
        <router-link to="/admin/projects"><i class="el-icon-back"></i></router-link>
        <span v-if="this.$route.params.id">修改预约项目</span>
        <span v-else>创建预约项目</span>
      </div>
      <el-form ref="form" :model="form">
        <el-form-item>
          <cover-picker :image="form.image" ref="coverPickerRef"></cover-picker>
        </el-form-item>
        <el-form-item>
          <div class="title-wrapper">
            <el-input v-model="form.name" placeholder="请输入预约项目名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="desc-wrapper">
            <el-input type="textarea"
                      :rows="5"
                      placeholder="预约详情介绍或预约注意事项"
                      v-model="form.description">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <address-picker :address="form.address"
                          :latitude="form.latitude"
                          :longitude="form.longitude"
                          ref="addressPickerRef">
          </address-picker>
        </el-form-item>
        <el-form-item>
          <div class="form-check">
            <span class="form-item-text">审核模式: </span>
            <el-radio v-model="form.check_mode" label="auto">自动审核</el-radio>
            <el-radio v-model="form.check_mode" label="manual">人工审核</el-radio>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="form-time-period-select">
            <span class="form-item-text">预约时间设置:</span>
            <el-radio-group v-model="form.multi_time">
              <el-radio :label="false">预约单时段</el-radio>
              <el-radio :label="true">预约多时段</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <time-setter :timeState="form.time_state" ref="timeSetterRef"></time-setter>
        </el-form-item>
        <el-form-item>
          <div class="form-reservation-limit">
            <span class="form-item-text">单人预约上限</span>
            <div class="limit-control">
              <el-switch
                v-model="reservationLimit"
                active-color="#409EFF"
                inactive-color="#909997">
              </el-switch>
              <div class="limit-input" v-if="reservationLimit">
                <span class="form-item-text">每人可预约</span>
                <el-input v-model="reservationPerUser">
                  <template slot="append">次</template>
                </el-input>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="form-day-display">
            <span class="form-item-text">
              <span>预约期限</span>
              <el-tooltip class="item"
                          effect="dark"
                          placement="top-start">
                <div slot="content">即用户可预约未来多少天内的项目，最大可设置为7天，1天内指的是当天，以此推算。</div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </span>
            <el-input v-model="form.date_display"
                      type="number"
                      placeholder="请输入1-7之间的整数">
              <template slot="append">天内</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="form-ahead-time">
            <span class="form-item-text">预约至少提前</span>
            <el-input v-model="aheadTime"
                      type="number"
                      class="ahead-time-input"
                      placeholder="如不填写则默认可从当天开始预约">
              <template slot="append">
                <el-select v-model="timeSelect" class="ahead-time-select">
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="form-btn">
        <el-button>
          <router-link to="/admin/projects">取消</router-link>
        </el-button>
        <el-button type="primary" @click="submitForm" :disabled="submitButtonDisabled">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import coverPicker from '@/components/cover_picker.vue'
  import addressPicker from '@/components/map.vue'
  import timeSetter from '@/components/time_setter.vue'
  const TIP = {
    'loading': '拼命加载中',
    'name_error': '预约项目名称不能为空'
  }
  const SELECT_OPTIONS = [
    {value: 'day', label: '天'},
    {value: 'hour', label: '小时'},
    {value: 'minute', label: '分钟'}
  ]
  export default {
    components: {
      "cover-picker": coverPicker,
      "address-picker": addressPicker,
      "time-setter": timeSetter
    },

    data() {
      return {
        form: {
          image: '',
          name: '',
          description: '',
          address: '',
          latitude: 0,
          longitude: 0,
          check_mode: 'auto',
          time_state: {
            normal: [
             {time: '09:00-10:00', limit: 10, weekday: ['Mon','Tues','Wed','Thur','Fri']}
            ],
            special: []
          },
          multi_time: false,
          date_display: 7,
        },
        reservationLimit: false,
        reservationPerUser: 1,
        aheadTime: '',
        timeSelect: 'day',
        selectOptions: SELECT_OPTIONS,
        submitButtonDisabled: false
      } 
    },

    created() {
      if(this.$route.params.id) {
        const loading = this.$loading({
          text: TIP.loading,
          spinner: 'el-icon-loading',
          customClass: 'loading-style'
        });
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id, this.getRequestConfig()).then(res => {
          this.form = res.data;
          this.updateProps(this.form);
          this.updateForm(this.form)
          loading.close();
        }).catch(err => {
          loading.close();
          this.handleHttpError(err);
        })
      }
    },
    methods: {
      updateProps(form) {
        var address_picker_args = {};
        address_picker_args.address = form.address;
        address_picker_args.latitude = form.latitude;
        address_picker_args.longitude = form.longitude;
        this.$refs.coverPickerRef.updateValue(form.image);
        this.$refs.addressPickerRef.updateValue(address_picker_args);
        this.$refs.timeSetterRef.updateValue(form.time_state);
      },
      updateForm(form) {
        if(form.reservation_per_user) {
          this.reservationLimit = true;
          this.reservationPerUser = form.reservation_per_user;
        }
        this.timeSelect = Object.keys(form.ahead_time)[0];
        this.aheadTime = Number(Object.values(form.ahead_time)[0]);
      },
      getComponentsData() {
        this.form.image = this.$refs.coverPickerRef.getData();
        this.form.time_state = this.$refs.timeSetterRef.getData();
        var address_data = this.$refs.addressPickerRef.getData();
        this.form.address = address_data.address;
        this.form.latitude = address_data.latitude;
        this.form.longitude = address_data.longitude;
      },
      getFormData() {
        this.getComponentsData();
        var form_data = new FormData();
        var form_array = ['name', 'description', 'address', 'latitude', 'longitude', 'check_mode', 'image', 'multi_time', 'date_display'];
        form_array.forEach(item => {
          form_data.append(item, this.form[item]);
        })
        form_data.append('time_state', JSON.stringify(this.form.time_state));
        if(this.reservationLimit) {
          form_data.append('reservation_per_user', this.reservationPerUser);
        }
        form_data.append('ahead_time', JSON.stringify(this.getAheadTime()));

        return form_data;
      },
      getAheadTime() {
        var ahead_time = {};
        if(this.timeSelect === 'day') {
          ahead_time.day = this.aheadTime;
        } else if(this.timeSelect === 'hour') {
          ahead_time.hour = this.aheadTime;
        } else if(this.timeSelect === 'minute') {
          ahead_time.minute = this.aheadTime;
        }
        return ahead_time;
      },
      submitForm() {
        var formData = this.getFormData();
        if(this.form.name) {
          this.submitButtonDisabled = true;
          if(this.$route.params.id) {
            this.$http.put(this.GLOBAL.requestUrls.project + this.$route.params.id, formData, this.getRequestConfig()).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
              this.submitButtonDisabled = false;
              this.$router.push(this.GLOBAL.routers.projects);
              this.$message.success('修改' + this.form.name + '预约项目成功')
            }).catch(err => {
              this.submitButtonDisabled = false;
              this.handleHttpError(err);
            })
          } else {
            this.$http.post(this.GLOBAL.requestUrls.projects, formData, this.getRequestConfig()).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
              this.$router.push(this.GLOBAL.routers.projects);
              this.submitButtonDisabled = false;
              this.$message.success('添加' + this.form.name + '预约项目成功')
            }).catch(err => {
              this.submitButtonDisabled = false;
              this.handleHttpError(err);
            })
          }
        } else {
          this.$message.error(TIP.name_error)
        }
      }
    }
  }
</script>