import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";

Vue.config.productionTip = false;

/*从babel的官方网站下载babel-polyfill,安装到web应用的头部即可轻松解决问题,并能支持ES6所有的新方法**/
import "babel-polyfill";

//svg图标
import "@/assets/style.css";

//引入animate.css动画
import animate from "animate.css";
Vue.use(animate);

import YDUI from "vue-ydui"; /* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import "vue-ydui/dist/ydui.rem.css";
Vue.use(YDUI);

//清除不必要的样式
import '@/assets/css/reset.css'

// 定义全局加载组件
/* import { Vwaiting, Cwaiting } from "@/assets/js/showWating.js";
window.app = Object.assign({}, { Vwaiting, Cwaiting }); */

// 图片懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  loading: require("@/assets/loading-bars.svg")
  // loading: require('@/assets/img/logo.png')
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
