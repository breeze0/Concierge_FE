<template>
  <div>
    <div class="form-address">
      <span class="address-text">详细地址: </span>
      <el-input class="address-input"
                v-model="currentAddress"
                @focus="handleFocus">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="search"></el-button>
      </el-input>
    </div>
    <div id="map-container" v-show="isShowMap"></div>
    <div id="map-panel" v-show="isShowPanel"></div>
    <div class="map-close" @click="closeMap" v-show="isShowMap">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      address: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        currentAddress: this.address,
        latitude: 0,
        longtitude: 0,
        isShowMap: false,
        isShowPanel: false,
        isInitMap: true,
        markers: [],
      }
    },
    methods: {
      handleFocus() {
        this.isShowMap = true;
        if(this.$route.params.id && this.isInitMap) {
          this.mapInit();
          this.isInitMap = false;
        } else if(!this.currentAddress) {
          this.mapInit()
        }
      },
      mapInit() {
        var _this = this;
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
      },
      mapClick() {
        var _this = this;
        this.map.on('click', function(e) {
          var lng = e.lnglat.getLng();
          var lat = e.lnglat.getLat();
          _this.map.remove(_this.markers);
          _this.latitude = lat;
          _this.longtitude = lng;
          var marker = new AMap.Marker({
            position: [lng, lat]
          });
          marker.setMap(_this.map);
          _this.map.setZoom(14);
          _this.map.setCenter([lng, lat]);
          _this.markers.push(marker);
          _this.geocoder.getAddress([lng, lat], function(status, result) {
            if(status === 'complete' && result.info === 'OK') {
              _this.currentAddress = result.regeocode.formattedAddress;
              _this.infoWindow.setContent("<div>"+ result.regeocode.formattedAddress + "</div");
              _this.infoWindow.open(_this.map, [lng, lat]);
              marker.on('click', function() {
                _this.infoWindow.open(_this.map, [lng, lat]);
                _this.latitude = lat;
                _this.longtitude = lng;
              })
            }
          });
          _this.placeSearch.clear();
        });
        this.placeSearch.on('listElementClick', function(event) {
          _this.latitude = event.data.location.lat;
          _this.longtitude = event.data.location.lng;
          _this.currentAddress = event.data.cityname + event.data.adname + event.data.address;
        });
        this.placeSearch.on('markerClick', function(event) {
          _this.latitude = event.data.location.lat;
          _this.longtitude = event.data.location.lng;
          _this.currentAddress = event.data.cityname + event.data.adname + event.data.address;
        });
      },
      search() {
        this.isShowPanel = true;
        this.map.remove(this.markers);
        this.infoWindow.close();
        this.placeSearch.search(this.currentAddress);
      },
      closeMap() {
        this.isShowPanel = false;
        this.placeSearch.clear();
        this.isShowMap = false;
      },
      deliverData() {
        var args = {
          "address": this.currentAddress,
          "longtitude": this.longtitude,
          "latitude": this.latitude
        }
        this.$emit("on-change",args);
      }
    },
    watch: {
      address(val) {
        this.currentAddress = val;
      }

    }
  }
</script>