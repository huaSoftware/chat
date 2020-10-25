import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import App from "./App";
import router from "./router";
import store from "./store";

import "@/icons"; // icon
import "@/permission"; // permission control

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));

Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;
// 图片懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  preLoad: 1.3, //预加载的宽高比
  loading: require("@/assets/img/loading-bars.svg"),
  error: require("@/assets/img/default.png"),
  attempt: 3, //尝试加载次数
  throttleWait: 500,
});
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
