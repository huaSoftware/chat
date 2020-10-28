/*
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-10-28 20:57:47
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'


Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const store = new Vuex.Store({
  modules,
  getters
})

export default store


