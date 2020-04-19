/*
 * @Author: hua
 * @Date: 2019-06-10 16:27:01
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-19 17:35:18
 */
import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import codeData from "./modules/code-data";
import user from "./modules/user";
import roomData from "./modules/room-data";
Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context("./modules", true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const store = new Vuex.Store({
  modules,
  getters,
  codeData,
  user,
  roomData
});

export default store;
