<template>
  <div class="form-com-container">
    <div class="return-to-prev">
      <router-link to="/admin/projects"><i class="el-icon-back"></i></router-link>
      <span v-if="this.$route.params.id">修改预约项目</span>
      <span v-else>创建预约项目</span>
    </div>
    <div class="form-wrapper">
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
            <span class="check-text">审核模式: </span>
            <el-radio v-model="form.check_mode" label="auto">自动审核</el-radio>
            <el-radio v-model="form.check_mode" label="manual">人工审核</el-radio>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="form-time-period-select">
            <span class="select-text">预约时间设置:</span>
          </div>
        </el-form-item>
        <el-form-item>
          <time-setter :timeState="form.time_state" ref="timeSetterRef"></time-setter>
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
  import coverPicker from '@/components/cover_picker.vue'
  import addressPicker from '@/components/map.vue'
  import timeSetter from '@/components/time_setter.vue'
  const TIP = {
    'loading': '拼命加载中',
    'name_error': '预约项目名称不能为空'
  }
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
          }
        }
      } 
    },

    created() {
      if(this.$route.params.id) {
        const loading = this.$loading({
          text: TIP.loading,
          spinner: 'el-icon-loading',
          background: '#f1f1f1',
          customClass: 'loading-style'
        });
        this.$http.get(this.GLOBAL.requestUrls.project + this.$route.params.id, this.getRequestConfig()).then(res => {
          this.form = res.data;
          this.updateProps(this.form);
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
        var formData = new FormData();
        var form_array = ['name', 'description', 'address', 'latitude', 'longitude', 'check_mode', 'image'];
        form_array.forEach(item => {
          formData.append(item, this.form[item]);
        })
        formData.append('time_state', JSON.stringify(this.form.time_state))
        return formData;
      },
      submitForm() {
        var formData = this.getFormData();
        if(this.form.name) {
          if(this.$route.params.id) {
            this.$http.put(this.GLOBAL.requestUrls.project + this.$route.params.id, formData, this.getRequestConfig()).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
              this.$router.push(this.GLOBAL.routers.projects);
              this.$message.success('修改' + this.form.name + '预约项目成功')
            }).catch(err => {
              this.handleHttpError(err);
            })
          } else {
            this.$http.post(this.GLOBAL.requestUrls.projects, formData, this.getRequestConfig()).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
              this.$router.push(this.GLOBAL.routers.projects);
              this.$message.success('添加' + this.form.name + '预约项目成功')
            }).catch(err => {
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