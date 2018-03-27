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
            <img :src="form.cover" class="form-cover">
            <div class="change-cover-btn">
              <el-button type="primary" size="small" @click="modalVisible = true">更换封面</el-button>
              <el-dialog
                title="更换封面"
                :visible.sync="modalVisible"
                width="800px"
                center>
                <div class="imgs-list">
                  <div class="upload imgs-item">
                    <label for="upload-img">
                      <i class="el-icon-upload"></i>
                      <div>上传图片</div>
                    </label>
                    <input type="file"
                    id="upload-img"
                    @change="handleChange"
                    accept="image/png,image/jpeg">
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
            <el-input v-model="form.title" placeholder="请输入预约项目名称"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="desc-wrapper">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="预约详情介绍或预约注意事项"
              v-model="form.desc">
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
          <div class="map-close" @click="closeMap" v-show="isShowClose">
            <i class="el-icon-close"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="form-check">
            <span class="check-text">审核模式: </span>
            <el-radio v-model="form.check" label="auto_check">自动审核</el-radio>
            <el-radio v-model="form.check" label="manual_check">人工审核</el-radio>
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
              <div class="normal-setting-item" v-for="item in formatedForm.time_state.normal"
                @mouseover="handeHover"
                @mouseout="isHover = false">
                <span>{{ item.time }}</span>
                <div>
                  <span v-for="day in item.weekday" class="weekday">{{ day }}</span>
                </div>
                <span v-if="item.limit < 10000">名额{{ item.limit }}人</span>
                <span v-else>名额不限制</span>
                <span class="operate-btn" v-show="isHover">
                  <i class="el-icon-circle-plus-outline"></i>
                  <i class="el-icon-remove-outline" v-show="!isOnlyone"></i>
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          cover: './static/images/img1.jpg',
          title: '',
          desc: '',
          address: '',
          location: [],
          check: 'auto_check',
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
        modalVisible: false,
        isShowMap: false,
        isShowPanel: false,
        isShowClose: false,
        map: null,
        markers: [],
        geocoder: null,
        placeSearch: null,
        infoWindow: null,
        isShowNormal: true,
        isHover: false,
        isOnlyone: false
      } 
    },

    computed: {
      formatedForm() {
        var array = [];
        this.form.time_state.normal.forEach(function(item, index) {
          item.weekday.forEach(function(value,i) {
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
            }
          })
          item.weekday = array;
        })
        return this.form;
      }
    },

    methods: {
      handleChange(event) {
        var file = event.target;
        var _this = this;
        if (file.files && file.files[0]) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            _this.form.cover = evt.target.result;
          }
          reader.readAsDataURL(file.files[0]);
        }
        this.modalVisible = false;
      },
      changeCover(index) {
        this.form.cover = this.localImages[index];
        this.modalVisible = false;
      },
      handleFocus() {
        this.isShowMap = true;
        this.isShowClose = true;
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
          _this.form.location = [lng, lat];
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
                _this.form.location = [lng, lat];
              })
            }
          });
          _this.placeSearch.clear();
        });
        this.placeSearch.on('listElementClick', function(event) {
          _this.form.location = [event.data.location.lng, event.data.location.lat];
          _this.form.address = event.data.cityname + event.data.adname + event.data.address;
        });
        this.placeSearch.on('markerClick', function(event) {
          _this.form.location = [event.data.location.lng, event.data.location.lat];
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
        this.isShowClose = false;
        console.log(this.form)
      },
      handeHover() {
        this.isHover = true;
        if(this.form.time_state.normal.length == 1) {
          this.isOnlyone = true;
        }
      }
    }
  }
</script>