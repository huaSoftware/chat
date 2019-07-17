import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";

Vue.config.productionTip = false;

/*从babel的官方网站下载babel-polyfill,安装到web应用的头部即可轻松解决问题,并能支持ES6所有的新方法**/
import "babel-polyfill";

//重置css
import "@/assets/scss/reset.scss"

//svg图标
import "@/assets/style.css";

//引入animate.css动画
import animate from "animate.css";
Vue.use(animate);

import YDUI from "vue-ydui"; /* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import "vue-ydui/dist/ydui.rem.css";
Vue.use(YDUI);


// 图片懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  loading: require("@/assets/loading-bars.svg")
  // loading: require('@/assets/img/logo.png')
});

//图片点击全屏
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
let options = {
  fullscreenEl: false
};
Vue.use(preview, options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
