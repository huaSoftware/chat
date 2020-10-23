/*
 * @Author: hua
 * @Date: 2020-02-27 18:48:10
 * @description: 用户路由模块
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:24:14
 */

const _import = require('../_import_' + process.env.NODE_ENV)

const myRouter = [
    // 我的
    {
        path: '/my', // 路径
        name: 'my', // 给他个名字，后期路由传参用
        component: _import('my/my'), // 载入组件
        meta: { title: '我的', isShowHead: true, isShowFoot: true, isShowBack: false, backPath:'home'} // 定义一些公共状态，你喜欢就好
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
    }
]
export default myRouter