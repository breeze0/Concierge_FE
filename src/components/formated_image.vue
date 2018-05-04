<template>
  <div :class="imgWrapperClass">
    <img :src="fomatedUrl" :class="imgClass" @load="handleOnload">
  </div>
</template>

<script>
  export default {
    props: {
      originUrl: {
        type: String,
        default: ''
      },
      className: {
        type: String,
        default: ''
      },
      imageWrapper: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        imgClass: this.className,
        imgWrapperClass: this.imageWrapper
      }
    },
    computed: {
      fomatedUrl() {
        if(this.originUrl) {
          return this.GLOBAL.server + this.originUrl;
        }
      }
    },
    methods: {
      handleOnload() {
        this.$emit('onLoad');
      }
    }
  }
</script>