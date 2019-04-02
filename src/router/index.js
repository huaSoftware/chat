import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

const router = new Router({
  routes: [
    // 根路径.跳转首页
    {
      path: '/',
      redirect: '/ad'
    },
    // 广告
    {
      path: '/ad', // 路径
      name: 'ad', // 给他个名字，后期路由传参用
      component: _import('ad/ad'), // 载入组件
      meta: { title: '广告', isShowHead: false, isShowFoot: false, isShowBack: false, backPath:'home'} // 定义一些公共状态，你喜欢就好
    },
    //注册
    {
      path: '/auth/register', // 路径
      name: 'authRegister', // 给他个名字，后期路由传参用
      component: _import('auth/register'), // 载入组件
      meta: { title: '注册', isShowHead: true, isShowFoot: false, isShowBack: false, backPath:null} // 定义一些公共状态，你喜欢就好
    },
    //登录
    {
      path: '/auth/login', // 路径
      name: 'authLogin', // 给他个名字，后期路由传参用
      component: _import('auth/login'), // 载入组件
      meta: { title: '登录', isShowHead: true, isShowFoot: false, isShowBack: false, backPath:null} // 定义一些公共状态，你喜欢就好
    },
    // 首页
    {
      path: '/home', // 路径
      name: 'home', // 给他个名字，后期路由传参用
      component: _import('home/home'), // 载入组件
      meta: { title: '消息', isShowHead: true, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 通讯录
    {
      path: '/addressBook', // 路径
      name: 'addressBook', // 给他个名字，后期路由传参用
      component: _import('addressBook/addressBook'), // 载入组件
      meta: { title: '通讯录', isShowHead: true, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 我的
    {
      path: '/my', // 路径
      name: 'my', // 给他个名字，后期路由传参用
      component: _import('my/my'), // 载入组件
      meta: { title: '我的', isShowHead: true, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 我的/设置
    {
      path: '/my/set', // 路径
      name: 'mySet', // 给他个名字，后期路由传参用
      component: _import('my/set/set'), // 载入组件
      meta: { title: '设置', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'my'} // 定义一些公共状态，你喜欢就好
    },
    // 我的/设置/新消息提醒
    {
      path: '/my/set/alert', // 路径
      name: 'mySetAlert', // 给他个名字，后期路由传参用
      component: _import('my/set/alert'), // 载入组件
      meta: { title: '新消息提醒', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'mySet'} // 定义一些公共状态，你喜欢就好
    },
    // 我的/设置/关于我们
    {
      path: '/my/set/about', // 路径
      name: 'mySetAbout', // 给他个名字，后期路由传参用
      component: _import('my/set/about'), // 载入组件
      meta: { title: '关于我们', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'mySet'} // 定义一些公共状态，你喜欢就好
    },
    // 新的朋友
    {
      path: '/my/newFriend', // 路径
      name: 'newFriend', // 给他个名字，后期路由传参用
      component: _import('my/newFriend'), // 载入组件
      meta: { title: '新的朋友', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'my'} // 定义一些公共状态，你喜欢就好
    },
    // 搜索
    {
      path: '/search', // 路径
      name: 'search', // 给他个名字，后期路由传参用
      component: _import('search/search'), // 载入组件
      meta: { title: '搜索', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'home'} // 定义一些公共状态，你喜欢就好
    },
    //房间
    {
      path: '/room',
      name: 'room',
      component: _import('room/room'),
      meta: { title: '房间', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'home'} // 定义一些公共状态，你喜欢就好

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
