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
      },
      latitude: {
        type: Number,
        default: 0
      },
      longtitude: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        currentAddress: this.address,
        currentLatitude: this.latitude,
        currentLongtitude: this.longtitude,
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
        this.map = new AMap.Map('map-container', {
          zoom: 12
        });
        AMap.plugin('AMap.Geocoder',()=> {
            this.geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            });
            this.map.addControl(this.geocoder)
         });
        AMap.service(["AMap.PlaceSearch"], ()=> {
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            city: "028",
            map: this.map,
            panel: "map-panel",
            renderStyle: 'default'
          })
        });
        AMap.plugin("AMap.InfoWindow", ()=> {
          this.infoWindow = new AMap.InfoWindow({
            content: '',
            autoMove: true,
            closeWhenClickMap: true
          });
        });
        this.mapClick();
        if(this.currentLatitude && this.currentLongtitude) {
          var marker = new AMap.Marker({
            position: [this.currentLongtitude,this.currentLatitude]
          });
          marker.setMap(this.map);
          this.map.setZoom(14);
          this.map.setCenter([this.currentLongtitude, this.currentLatitude]);
          this.markers.push(marker);
        }
      },
      mapClick() {
        this.map.on('click', (e)=> {
          var lng = e.lnglat.getLng();
          var lat = e.lnglat.getLat();
          this.map.remove(this.markers);
          this.currentLatitude = lat;
          this.currentLongtitude = lng;
          var marker = new AMap.Marker({
            position: [lng, lat]
          });
          marker.setMap(this.map);
          this.map.setZoom(14);
          this.map.setCenter([lng, lat]);
          this.markers.push(marker);
          this.geocoder.getAddress([lng, lat], (status, result)=> {
            if(status === 'complete' && result.info === 'OK') {
              this.currentAddress = result.regeocode.formattedAddress;
              this.infoWindow.setContent("<div>"+ result.regeocode.formattedAddress + "</div");
              this.infoWindow.open(this.map, [lng, lat]);
              marker.on('click', ()=> {
                this.infoWindow.open(this.map, [lng, lat]);
                this.currentLatitude = lat;
                this.currentLongtitude = lng;
              })
            }
          });
          this.placeSearch.clear();
        });
        this.placeSearch.on('listElementClick', (event)=> {
          this.currentLatitude = event.data.location.lat;
          this.currentLongtitude = event.data.location.lng;
          this.currentAddress = event.data.cityname + event.data.adname + event.data.address;
        });
        this.placeSearch.on('markerClick', (event)=> {
          this.currentLatitude = event.data.location.lat;
          this.currentLongtitude = event.data.location.lng;
          this.currentAddress = event.data.cityname + event.data.adname + event.data.address;
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
      updateValue(args) {
        this.currentAddress = args.address;
        this.currentLatitude = args.latitude;
        this.currentLongtitude = args.longtitude;
      },
      getData() {
        var args = {
          "address": this.currentAddress,
          "latitude": this.currentLatitude,
          "longtitude": this.currentLongtitude
        }
        return args
      }
    }
  }
</script>