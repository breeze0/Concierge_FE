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
            <label for="file_input">
              <i class="el-icon-upload"></i>
              <div>上传图片</div>
            </label>
            <input type="file"
                   id="file_input"
                   accept="image/*"
                   @change="handleUpload"
                   ref="uploadImageRef">
          </div>
          <div class="imgs-item"
               v-for="(item,index) in formatedDafaultImage"
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
    methods: {
      getCovers() {
        var config = {
          headers: {
            'Authorization': this.getCookie('token')
          }
        };
        this.$http.get(this.GLOBAL.requestUrls.covers).then(res=> {
          this.defaultImageList = res.data.images;
          if(this.currentImage === '') {
            this.currentImage = this.defaultImageList[0]
          }
        })
      },
      handleUpload() {
        const loading = this.$loading({
          target: ".img-wrapper",
          background: "#f1f1f1"
        });
        lrz(this.$refs.uploadImageRef.files[0]).then(result=> {
          var config = {
            headers: {
              'Authorization': this.getCookie('token')
            }
          }
          var formData = new FormData();
          formData.append('image',result.formData.get('file'));
          this.$http.post(this.GLOBAL.requestUrls.image, formData, config).then(res=> {
            this.currentImage = res.data.image;
            setTimeout(()=>{
              loading.close();
            }, 200)
          })
        })
        this.coverModalVisible = false;
      },
      changeCover(index) {
        this.currentImage = this.defaultImageList[index];
        this.coverModalVisible = false;
      },
      updateValue(val) {
        this.currentImage = val;
      },
      getData() {
        return this.currentImage
      }
    }
  }
</script>