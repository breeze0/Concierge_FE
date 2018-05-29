<template>
  <div  class="project card-item" @click="showDetail">
    <el-card :body-style="{ padding: '0px' }">
      <formated-image :originUrl="project.image" :className="imageClass" class="image-wrapper"></formated-image>
      <div style="padding: 14px 12px;">
        <div class="project-name">{{ project.name }}</div>
        <div class="bottom bottom-flex">
          <div class="bottom-left" v-if="project.state === 'open'">
            <span class="state-icon" style="background-image: url('./static/images/open.jpg');"></span>
            <span class="project-state">开启</span>
          </div>
          <div class="bottom-left" v-else>
            <span class="state-icon" style="background-image: url('./static/images/close.jpg');"></span>
            <span class="project-state">关闭</span>
          </div>
          <span class="project-share" @click.stop="handleStopPropagation">
            <i class="el-icon-edit oprerate-icon" @click.stop="editProject"></i>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-share oprerate-icon"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="dropdown-container">
                <div class="text">
                  <span class="icon" style="background-image: url('./static/images/wechat.png');"></span>
                  <span>微信扫一扫</span>
                </div>
                <formated-image :originUrl="project.wxcode" :className="codeClass" class="code-wrapper"></formated-image>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import formatedImage from '@/components/formated_image.vue'


  export default {
    components: {
      "formated-image": formatedImage
    },
    props: {
      project: {
        type: Object,
        default: ''
      }
    },
    data() {
      return {
        imageClass: 'project-image',
        codeClass: 'code',

      }
    },
    methods: {
      handleStopPropagation(e) {
        e.stopPropagation()
      },
      editProject() {
        this.$router.push(this.GLOBAL.routers.projects_edit + this.project.id);
      },
      showDetail() {
        this.$router.push(this.GLOBAL.routers.reservations_details + this.project.id + '/' + this.project.name)
      }
    }
  }
</script>