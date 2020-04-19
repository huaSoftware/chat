/*
 * @Author: hua
 * @Date: 2019-06-10 16:26:59
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-18 18:28:40
 */
import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log

import * as filters from "./filters"; // global filters

Vue.use(Element, {
  size: Cookies.get("size") || "medium" // set element-ui default size
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

// 图片懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  preLoad: 1.3, //预加载的宽高比
  loading: require("@/assets/img/loading-bars.svg"),
  error: require("@/assets/img/default.png"),
  attempt: 3, //尝试加载次数
  throttleWait: 500
});

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
