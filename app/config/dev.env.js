/*
 * @Author: hua
 * @Date: 2019-04-26 19:59:52
 * @LastEditors: hua
 * @LastEditTime: 2019-05-29 20:03:20
 */
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_CLIENT_API: '"http://212.64.83.121:500"',
  VUE_APP_CLIENT_SOCKET:'"http://212.64.83.121:501"'
})
