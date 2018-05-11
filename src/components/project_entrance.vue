<template>
  <div @click="showDetail">
    <formated-image :originUrl="project.image" :className="imageClass" class="image-wrapper"></formated-image>
    <span class="project-name">{{ project.name }}</span>
    <span class="project-state" v-if="project.state === 'open'">开启</span>
    <span class="project-state" v-else>关闭</span>
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
          <div style="height: 50px;"></div>
        </el-dropdown-menu>
      </el-dropdown>
    </span>

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
        imageClass: 'project-image'
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