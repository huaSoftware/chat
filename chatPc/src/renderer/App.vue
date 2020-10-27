<!--
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-10-27 21:03:26
-->
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
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  padding-right:0px!important;
}
</style>
<style lang="scss">
@import "./assets/custom-theme/index.css";
@import "./styles/index.scss"; // 全局自定义的css样式
</style>
