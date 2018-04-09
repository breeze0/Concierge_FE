<template>
  <div class="img-wrapper">
    <img :src="formatedImage" class="form-cover">
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
      image: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        coverModalVisible: false,
        currentImage: this.image,
        defaultImageList: [],
      }
    },
    created() {
      this.getCovers();

    },
    computed: {
      formatedDafaultImage() {
        var newImage = this.defaultImageList.map(item=> {
          item = this.server + item;
          return item
        })
        return newImage
      },
      formatedImage() {
        if(this.currentImage) {
          var image =this.server + this.currentImage;
        }
        return image;
      }
    },
    watch: {
      image(val) {
        this.currentImage = val;
      },
      currentImage() {
        this.deliverData();
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
          if(this.currentImage === '') {
            this.currentImage = this.defaultImageList[0]
          }
        })
      },
      handleUpload(event) {
        var file = event.target;
        var _this = this;
        if (file.files && file.files[0]) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            _this.currentImage = evt.target.result;
          }
          reader.readAsDataURL(file.files[0]);
        }
        lrz(this.$refs.uploadImg.files[0]).then(result=> {
          var url = this.server + '/image';
          var config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': this.getCookie('token')
            }
          }
          var formData = new FormData();
          formData.append('image',result.formData.get('file'));
          this.$http.post(url, formData, config).then(res=> {
            _this.currentImage = res.data.image;
          })
        })

        this.coverModalVisible = false;
      },
      changeCover(index) {
        this.currentImage = this.defaultImageList[index];
        this.coverModalVisible = false;
      },
      deliverData() {
        var args = {"image": this.currentImage};
        this.$emit('on-change',args);
      }
    }
  }
</script>