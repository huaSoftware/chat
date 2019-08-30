import appData from "./modules/app-data";
import roomData from "./modules/room-data";
import codeData from './modules/code-data';
import routerStatus from './modules/router-status'
import user from "./modules/user";
import getters from "./getters";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
  strict: debug, // 在非生产环境下，使用严格模式
  modules: {
    appData,
    roomData,
    codeData,
    user,
    routerStatus
  },
  getters
});
export default store;
