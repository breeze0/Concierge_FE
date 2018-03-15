<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {

    }
  }
}
</script>

<style lang="scss">
html {
  height: 100%;

  body {
    height: 100%;
    margin: 0;
    padding: 0;

    #app {
      height: 100%;
    }
  }
}
</style>
