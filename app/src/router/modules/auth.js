/*
 * @Author: hua
 * @Date: 2019-11-01 13:55:09
 * @description: 认证路由模块
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:23:47
 */
const _import = require("../_import_" + process.env.NODE_ENV);

const authRouter = [
  // 根路径.跳转首页
  {
    path: "/",
    redirect: "/home",
  },
  // 广告
  {
    path: "/ad", // 路径
    name: "ad", // 给他个名字，后期路由传参用
    component: _import("ad/ad"), // 载入组件
    meta: {
      title: "广告",
      isShowHead: false,
      isShowFoot: false,
      isShowBack: false,
      backPath: "home",
    }, // 定义一些公共状态，你喜欢就好
  },
  //注册
  {
    path: "/auth/register", // 路径
    name: "authRegister", // 给他个名字，后期路由传参用
    component: _import("auth/register"), // 载入组件
    meta: {
      title: "注册",
      isShowHead: true,
      isShowFoot: false,
      isShowBack: false,
      backPath: null,
    }, // 定义一些公共状态，你喜欢就好
  },
  //登录
  {
    path: "/auth/login", // 路径
    name: "authLogin", // 给他个名字，后期路由传参用
    component: _import("auth/login"), // 载入组件
    meta: {
      title: "登录",
      isShowHead: true,
      isShowFoot: false,
      isShowBack: false,
      backPath: null,
    }, // 定义一些公共状态，你喜欢就好
  },
];
export default authRouter;
