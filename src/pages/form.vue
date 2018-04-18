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
                      v-model="form.des">
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
          des: '',
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
        this.$http.get(this.GLOBAL.requestUrls.projects_id + this.$route.params.id, this.getRequestConfig()).then(res => {
          this.form = res.data;
          this.updateProps(this.form);
          loading.close();
        }).catch(err => {
          if(err.response.status === 401) {
            this.delCookie('token');
            this.$router.push(this.GLOBAL.routers.login);
          }
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
        this.form.address = this.$refs.addressPickerRef.getData().address;
        this.form.latitude = this.$refs.addressPickerRef.getData().latitude;
        this.form.longitude = this.$refs.addressPickerRef.getData().longitude;
        this.form.time_state = this.$refs.timeSetterRef.getData();
      },
      getFormData() {
        this.getComponentsData();
        var formData = new FormData();
        formData.append('name',this.form.name);
        formData.append('description', this.form.des);
        formData.append('address', this.form.address);
        formData.append('latitude', this.form.latitude);
        formData.append('longitude', this.form.longitude);
        formData.append('time_state', JSON.stringify(this.form.time_state));
        formData.append('check_mode', this.form.check_mode);
        formData.append('image', this.form.image);
        return formData;
      },
      submitForm() {
        var formData = this.getFormData();
        if(this.form.name) {
          if(this.$route.params.id) {
            this.$http.put(this.GLOBAL.requestUrls.projects_id + this.$route.params.id, formData, this.getRequestConfig()).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
              this.$router.push(this.GLOBAL.routers.projects);
            }).catch(err => {
              this.delCookie('token');
              this.$router.push(this.GLOBAL.routers.login);
            })
          } else {
            this.$http.post(this.GLOBAL.requestUrls.projects, formData, this.getRequestConfig()).then((res)=> {
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
              this.$router.push(this.GLOBAL.routers.projects);
            }).catch(err => {
              this.delCookie('token');
              this.$router.push(this.GLOBAL.routers.login);
            })
          }
        } else {
          this.$message.error(TIP.name_error)
        }
      }
    }
  }
</script>