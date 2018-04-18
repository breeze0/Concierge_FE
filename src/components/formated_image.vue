<template>
  <div>
    <img :src="fomatedUrl" :class="imgClass">
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
      }
    },
    data() {
      return {
        imgClass: this.className
      }
    },
    computed: {
      fomatedUrl() {
        if(this.originUrl) {
          return this.GLOBAL.server + this.originUrl;
        }
      } 
    }
  }
</script>