<template>
  <div class="img-wrapper">
    <img :src="imageObject" class="form-cover">
    <div class="change-cover-btn">
      <el-button type="primary" size="small" @click="coverModalVisible = true">更换封面</el-button>
      <el-dialog title="更换封面"
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
                   @change="handleUpload"
                   accept="image/png,image/jpeg"
                   name="uploadImg" ref="uploadImg">
          </div>
          <div class="imgs-item" v-for="(item,index) in formatedDafaultImage"
               @click="changeCover(index)">
            <img :src="item" width="100%" height="100%">
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      uploadImage: {
        type: String,
        default: ''
      },
      defaultImage: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        coverModalVisible: false,
        currentUploadImage: this.uploadImage,
        currentDefaultImage: this.defaultImage,
        defaultImageList: [],
        tempImage: ''
      }
    },
    created() {
      this.getCovers();

    },
    computed: {
      imageObject() {
        if(this.currentUploadImage === '') {
          return this.currentDefaultImage
        } else if(this.currentDefaultImage === '') {
          return this.currentUploadImage
        }
      },
      formatedDafaultImage() {
        var newImage = this.defaultImageList.map(item=> {
          item = this.server + item;
          return item
        })
        return newImage
      }
    },
    watch: {
      uploadImage(val) {
        this.currentUploadImage = val;
      },
      defaultImage(val) {
        this.currentDefaultImage = val;
      }
    },
    methods: {

      getCovers() {
        var config = {
          headers: {
            'Authorization': this.getCookie('token')
          }
        };
        var url = this.server + '/covers';
        this.$http.get(url).then(res=> {
          this.defaultImageList = res.data.images;
          if(this.currentDefaultImage === '') {
            this.currentDefaultImage = this.server + this.defaultImageList[0]
          }
        })
      },
      handleUpload(event) {
        var file = event.target;
        var _this = this;
        if (file.files && file.files[0]) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            _this.currentUploadImage = evt.target.result;
            _this.currentDefaultImage = '';
            _this.deliverData();
          }
          reader.readAsDataURL(file.files[0]);
        }
        this.coverModalVisible = false;
      },
      changeCover(index) {
        this.currentDefaultImage = this.server + this.defaultImageList[index];
        this.tempImage = this.defaultImageList[index];
        this.currentUploadImage = '';
        this.deliverData();
        this.coverModalVisible = false;
      },
      deliverData() {
        var args = [this.currentDefaultImage,this.currentUploadImage, this.$refs.uploadImg.files[0]];
        this.$emit('on-change', args)
      }
    }
  }
</script>