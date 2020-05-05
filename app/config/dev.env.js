/*
 * @Author: hua
 * @Date: 2019-04-26 19:59:52
 * @LastEditors: hua
 * @LastEditTime: 2020-05-04 20:37:11
 */
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_CLIENT_SOCKET: '"https://api.zhuhui.store"',
  VUE_APP_CLIENT_API: '"https://api.zhuhui.store:500"',
  /* VUE_APP_CLIENT_SOCKET: '"http://127.0.0.1:501"',
  VUE_APP_CLIENT_API:'"http://127.0.0.1:501"', */
  VUE_APP_PUBLIC_KEY: `"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOaQO5ImLVJwdyDYx4c/QdOKbgB0bV5k/4n9UQej0RhegR8PAfy9bSTagR/2hxSsE5vaE4YjYGtSmFrsWfoUyQHbcJGIfSUUYkcE2OMq4mmENk5KbrUemWdFEIp0k/Y7DlPMAGUdt2YeRakY1gzUI9kyZOcuA0ZP6vzwe8wnFtMwIDAQAB-----END PUBLIC KEY-----"`,
});
