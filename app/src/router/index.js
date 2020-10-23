/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 路由模块
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:23:33
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import authRouter from './modules/auth'
import myRouter from './modules/my'
import roomRouter from './modules/room'
import groupRoomRouter from './modules/groupRoom'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

const router = new Router({
  routes: [
    ...authRouter,
    ...myRouter,
    ...roomRouter,
    ...groupRoomRouter,
    // 首页
    {
      path: '/home', // 路径
      name: 'home', // 给他个名字，后期路由传参用
      component: _import('home/home'), // 载入组件
      meta: { title: '消息', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defTextName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 通讯录
    {
      path: '/addressBook', // 路径
      name: 'addressBook', // 给他个名字，后期路由传参用
      component: _import('addressBook/addressBook'), // 载入组件
      meta: { title: '通讯录', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defTextName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 群聊
    {
      path: '/groupChat', // 路径
      name: 'groupChat', // 给他个名字，后期路由传参用
      component: _import('groupChat/groupChat'), // 载入组件
      meta: { title: '发起群聊', isShowHead: false, isShowFoot: true, isShowBack: false, backPath: -1} // 定义一些公共状态，你喜欢就好
    },
    // 搜索
    {
      path: '/search', // 路径
      name: 'search', // 给他个名字，后期路由传参用
      component: _import('search/search'), // 载入组件
      meta: { title: '添加好友', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'home'} // 定义一些公共状态，你喜欢就好
    },
    //错误页面
    {
      path: '/connectLose',
      name: 'connectLose',
      component: _import('error/connectLose'),
      meta: { title: '链接丢失', isShowHead: false, isShowFoot: false, isShowBack: false, backPath:'home'}
    }
  ]
})

// 在每个路由前执行一些东西
router.afterEach(function(to,from){
  //物理键绑定返回上一页
  window.physicsBackRouter = 'last'
  var toL = to.path.split('/').length;
  var fromL = from.path.split('/').length;
  var trans;
  if (toL == fromL) {
    trans = 'fade'
  } else {
    trans = toL > fromL ? 'next' : 'prev'
  }
  if (to.meta.title) {
    store.dispatch("updateNavbarTitle", to.meta.title);
  }
  //过渡效果
  store.dispatch('updateTransition', trans)
})
export default router
