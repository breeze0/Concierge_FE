<template>
  <div class="img-wrapper">
    <formated-image :originUrl="currentImage"
                    :className="classNames.form_cover"
                    :imageWrapper="classNames.cover_wrapper"
                    @onLoad="handleImageOnload"></formated-image>
    <div class="change-cover-btn">
      <el-button type="primary" class="change-cover" @click="coverModalVisible = true">更换封面</el-button>
      <el-dialog title="更换封面"
                 :visible.sync="coverModalVisible"
                 width="858px">
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
               v-for="(item,index) in defaultImageList"
               @click="changeCover(index)">
            <formated-image :originUrl="item"
                            :className="classNames.default_cover"
                            :imageWrapper="classNames.image_wrapper">
            </formated-image>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import formatedImage from '@/components/formated_image.vue'
  export default {
    components: {
      "formated-image": formatedImage
    },
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
        classNames: {
          form_cover: 'form-cover',
          default_cover: 'img',
          image_wrapper: 'item-img-wrapper',
          cover_wrapper: 'cover-wrapper'
        }
      }
    },
    created() {
      this.getCovers();

    },
    methods: {
      getCovers() {
        this.$http.get(this.GLOBAL.requestUrls.covers).then(res=> {
          this.defaultImageList = res.data.images;
          if(this.currentImage === '') {
            this.currentImage = this.defaultImageList[0];
          }
        })
      },
      handleImageOnload(loading) {
        if(this.loading) this.loading.close();
      },
      handleUpload() {
        this.loading = this.$loading({
          target: ".img-wrapper",
          background: "#f1f1f1"
        });
        lrz(this.$refs.uploadImageRef.files[0]).then(result=> {
          var formData = new FormData();
          formData.append('image',result.formData.get('file'));
          this.$http.post(this.GLOBAL.requestUrls.image, formData, this.getRequestConfig()).then(res=> {
            this.currentImage = res.data.image;
            this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
          }).catch(err => {
            this.handleHttpError(err);
          })
        }).catch(error => {
          var formData = new FormData();
          formData.append('image', this.$refs.uploadImageRef.files[0]);
          if(this.$refs.uploadImageRef.files[0].size < 5*1024*1024) {
            this.$http.post(this.GLOBAL.requestUrls.image, formData, this.getRequestConfig()).then(res=> {
              this.currentImage = res.data.image;
              this.setCookie('token',res.headers.authorization,this.GLOBAL.expire);
            })
          } else {
            this.$message.error('上传图片过大');
            this.loading.close();
          }
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