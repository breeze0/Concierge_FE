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
          <image-picker
            :image="form.image"
            @on-change="setCover">
          </image-picker>
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
          <address-picker
            :address="form.address"
            :latitude="form.latitude"
            :longtitude="form.longtitude"
            @on-change="setAddress">
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
          <time-setter
            :timeState="form.time_state"
            @on-change="setTimeState">
          </time-setter>
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
  import imagePicker from '@/components/image_picker.vue'
  import addressPicker from '@/components/map.vue'
  import timeSetter from '@/components/time_setter.vue'
  export default {
    components: {
      "image-picker": imagePicker,
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
          longtitude: 0,
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
      setCover(arg) {
        this.form.image = arg;
      },
      setAddress(args) {
        this.form.address = args.address;
        this.form.longtitude = args.longtitude;
        this.form.latitude = args.latitude;
      },
      setTimeState(arg) {
        this.form.time_state = arg;
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