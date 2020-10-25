<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="scss">
@import "./assets/custom-theme/index.css";
@import "./styles/index.scss"; // 全局自定义的css样式
</style>
