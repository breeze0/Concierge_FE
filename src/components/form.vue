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
          <div class="map-wrapper">
            <span>位置标注: </span>
            <el-input
            @focus="handleFocus"
            v-model="form.address"
            @input="handleInput">
              <el-button slot="append" type="primary" @click="closeMap">确定</el-button>
            </el-input>
          </div>
          <div id="map-container" v-show="isShowMap"></div>
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
          address: ''
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
        map: null,
        geocoder: null,
        info: null,
        markers: [],
        timer: null
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
      initMap() {
        if(!this.form.address) {
          var myLatlng = new qq.maps.LatLng(30.67, 104.06);
          var myOptions = {
            zoom: 13,
            center: myLatlng,
          }  
          this.map = new qq.maps.Map(document.getElementById("map-container"), myOptions);
          this.geocoder = new qq.maps.Geocoder();
          this.info = new qq.maps.InfoWindow({map: this.map});
          this.handleCityLocation();
          this.handleClickMap();
        }
      },
      clearOverlays(overlays) {
        var overlay;
        while (overlay = overlays.pop()) {
          overlay.setMap(null);
        }
      },
      handleCityLocation() {
        var _this = this;
        var citylocation = new qq.maps.CityService({
          complete : function(result){
            _this.map.setCenter(result.detail.latLng);
          }
        });
        citylocation.searchLocalCity();
      },
      handleClickMap() {
        var _this = this;
        qq.maps.event.addListener(_this.map, 'click', function(event) {
          var latLng = new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng());
          _this.geocoder.getAddress(latLng);
          _this.geocoder.setComplete(function(result) {
            _this.clearOverlays(_this.markers);
            _this.info.close();
            _this.form.address = result.detail.address;
            var marker = new qq.maps.Marker({
              map: _this.map,
              position: event.latLng
            });
            _this.info.open();
            _this.info.setContent('<div>'+ result.detail.address+'</div>');
            _this.info.setPosition(result.detail.location);
            _this.markers.push(marker);
            qq.maps.event.addListener(marker, 'click', function() {
              _this.info.open();
              _this.info.setContent('<div>'+ result.detail.address+'</div>');
              _this.info.setPosition(result.detail.location);
            })
          });
        });
      },

      search() {
        if(this.form.address) {
          var _this = this;
          this.geocoder.getLocation(this.form.address);
          this.geocoder.setComplete(function(result) {
            _this.map.setCenter(result.detail.location);
            _this.clearOverlays(_this.markers);
            _this.info.close();
            var marker = new qq.maps.Marker({
              map: _this.map,
              position: result.detail.location
            });
            _this.info.open();
            _this.info.setContent('<div>'+ _this.form.address +'</div>');
            _this.info.setPosition(result.detail.location);
            _this.markers.push(marker);
            qq.maps.event.addListener(marker, 'click', function() {
              _this.info.open();
              _this.info.setContent('<div>'+ _this.form.address +'</div>');
              _this.info.setPosition(result.detail.location);
            })
          })
        } else {
          this.initMap();
        }
      },

      handleFocus() {
        this.isShowMap = true;
        this.initMap();
      },

      handleInput() {
        var _this = this;
        if(this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(function() {
          _this.search();
        },1000)
      },
      closeMap() {
        this.isShowMap = false;
      }
    }
  }
</script>