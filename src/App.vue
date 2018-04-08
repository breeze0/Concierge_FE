<template>
  <div id="app">
    <router-view name="nav"/>
    <router-view name="content"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  }
}
</script>