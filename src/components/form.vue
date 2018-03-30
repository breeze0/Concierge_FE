<template>
  <div class="form-com-container">
    <div class="return_to_prev">
      <router-link to="/admin"><i class="el-icon-back"></i></router-link>
      <span>创建新预约项目</span>
    </div>
    <div class="form-wrapper">
      <el-form ref="form" :model="form">
        <el-form-item>
          <div class="img-wrapper">
            <img :src="imageObject" class="form-cover">
            <div class="change-cover-btn">
              <el-button type="primary" size="small" @click="coverModalVisible = true">更换封面</el-button>
              <el-dialog
                title="更换封面"
                :visible.sync="coverModalVisible"
                width="800px"
                center>
                <div class="imgs-list">
                  <div class="upload imgs-item">
                    <label for="uploadImg">
                      <i class="el-icon-upload"></i>
                      <div>上传图片</div>
                    </label>
                    <input type="file"
                    id="uploadImg"
                    @change="handleChange"
                    accept="image/png,image/jpeg"
                    name="uploadImg" ref="uploadImg">
                  </div>
                  <div class="imgs-item" v-for="(item,index) in localImages"
                  @click="changeCover(index)">
                    <img :src="item" width="100%" height="100%">
                  </div>
                </div>
              </el-dialog>
            </div>
          </div>
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
          <div class="form-address">
            <span class="address-text">详细地址: </span>
            <el-input class="address-input"
            v-model="form.address"
            @focus="handleFocus">
              <el-button slot="append" icon="el-icon-search"
              @click="search"></el-button>
            </el-input>
          </div>
          <div id="map-container" v-show="isShowMap"></div>
          <div id="map-panel" v-show="isShowPanel"></div>
          <div class="map-close" @click="closeMap" v-show="isShowMap">
            <i class="el-icon-close"></i>
          </div>
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
                  <i class="el-icon-circle-plus-outline" @click="enterSetting"></i>
                  <i class="el-icon-remove-outline" v-show="formatedForm.length > 1"
                  @click="deleteItem(index)"></i>
                </span>
              </div>
              <el-dialog
                title="预约时间设置"
                :visible.sync="settingDialogVisible"
                width="50%"
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
                      value-format="HH:mm">
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
                    <el-input v-model="limitValue" class="count-input" placeholder="不填写则默认为无限制" type="number"></el-input>
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
        <el-button>取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          image: '',
          default_image: './static/images/img1.jpg',
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
        localImages: [
          './static/images/img1.jpg',
          './static/images/img2.png',
          './static/images/img3.jpg',
          './static/images/img4.jpg',
          './static/images/img5.jpg',
          './static/images/img6.jpg',
          './static/images/img7.jpg',
          './static/images/img8.jpg',
          './static/images/img9.png'
        ],
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
        coverModalVisible: false,
        settingDialogVisible: false,
        isShowMap: false,
        isShowPanel: false,
        markers: [],
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
      },
      imageObject() {
        if(this.form.image === '') {
          return this.form.default_image
        } else if(this.form.default_image === '') {
          return this.form.image
        }
      }
    },

    methods: {
      handleChange(event) {
        var file = event.target;
        var _this = this;
        if (file.files && file.files[0]) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            _this.form.image = evt.target.result;
            _this.form.default_image = '';
          }
          reader.readAsDataURL(file.files[0]);
        }
        this.coverModalVisible = false;
      },
      changeCover(index) {
        this.form.default_image = this.localImages[index];
        this.form.image = '';
        this.coverModalVisible = false;
      },
      handleFocus() {
        this.isShowMap = true;
        this.mapInit();
      },
      mapInit() {
        var _this = this;
        if(!this.form.address) {
          this.map = new AMap.Map('map-container', {
            zoom: 12
          });
          AMap.plugin('AMap.Geocoder',function(){
              _this.geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all'
              });
              _this.map.addControl(_this.geocoder)
           });
          AMap.service(["AMap.PlaceSearch"], function() {
            _this.placeSearch = new AMap.PlaceSearch({
              pageSize: 5,
              pageIndex: 1,
              city: "028",
              map: _this.map,
              panel: "map-panel",
              renderStyle: 'default'
            })
          });
          AMap.plugin("AMap.InfoWindow", function() {
            _this.infoWindow = new AMap.InfoWindow({
              content: '',
              autoMove: true,
              closeWhenClickMap: true
            });
          });

          this.mapClick();
        }
      },
      mapClick() {
        var _this = this;
        this.map.on('click', function(e) {
          var lng = e.lnglat.getLng();
          var lat = e.lnglat.getLat();
          _this.map.remove(_this.markers);
          _this.form.latitude = lat;
          _this.form.longtitude = lng;
          var marker = new AMap.Marker({
            position: [lng, lat]
          });
          marker.setMap(_this.map);
          _this.map.setZoom(14);
          _this.map.setCenter([lng, lat]);
          _this.markers.push(marker);
          _this.geocoder.getAddress([lng, lat], function(status, result) {
            if(status === 'complete' && result.info === 'OK') {
              _this.form.address = result.regeocode.formattedAddress;
              _this.infoWindow.setContent("<div>"+ result.regeocode.formattedAddress + "</div");
              _this.infoWindow.open(_this.map, [lng, lat]);
              marker.on('click', function() {
                _this.infoWindow.open(_this.map, [lng, lat]);
                _this.form.latitude = lat;
                _this.form.longtitude = lng;
              })
            }
          });
          _this.placeSearch.clear();
        });
        this.placeSearch.on('listElementClick', function(event) {
          _this.form.latitude = event.data.location.lat;
          _this.form.longtitude = event.data.location.lng;
          _this.form.address = event.data.cityname + event.data.adname + event.data.address;
          console.log(_this.form)
        });
        this.placeSearch.on('markerClick', function(event) {
          _this.form.latitude = event.data.location.lat;
          _this.form.longtitude = event.data.location.lng;
          _this.form.address = event.data.cityname + event.data.adname + event.data.address;
        });
      },
      search() {
        this.isShowPanel = true;
        this.map.remove(this.markers);
        this.infoWindow.close();
        this.placeSearch.search(this.form.address);
      },
      closeMap() {
        this.isShowPanel = false;
        this.placeSearch.clear();
        this.isShowMap = false;
      },
      enterSetting() {
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
        var time = this.timeValue[0] + '-' + this.timeValue[1];
        var weekday = this.weekdayValue;
        if(this.limitValue === '') {
          limit = 65535
        } else {
          limit = this.limitValue;
        }
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
        formData.append('des', this.form.des);
        formData.append('image', this.$refs.uploadImg.files[0]);
        formData.append('default_image', this.form.default_image);
        formData.append('address', this.form.address);
        formData.append('latitude', this.form.latitude);
        formData.append('longtitude', this.form.longtitude);
        formData.append('time_state', JSON.stringify(this.form.time_state));
        formData.append('check_mode', this.form.check_mode);
        var config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": this.getCookie('token')
          }
        }
        if(this.form.name) {
          this.$http.post(this.server+'/projects',formData,config).then((res)=> {
            this.setCookie('token',res.headers.authorization,this.expire);
            this.$router.push('/admin');
          })
        } else {
          this.$message.error('预约项目名称不能为空')
        }
      }
    }
  }
</script>