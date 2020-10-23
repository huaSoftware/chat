/*
 * @Author: hua
 * @Date: 2020-02-27 18:48:10
 * @description: 房间路由模块
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:24:26
 */

const _import = require('../_import_' + process.env.NODE_ENV)

const roomRouter = [
   //房间
   {
    path: '/room',
    name: 'room',
    component: _import('room/room'),
    meta: { title: '房间', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'home', isShowDef:true, defTextName:'详情', defPath:'roomDetails'} // 定义一些公共状态，你喜欢就好
  },
  //房间详情
  {
    path: '/room/details',
    name: 'roomDetails',
    component: _import('room/details'),
    meta: { title: '房间详情', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:-1} // 定义一些公共状态，你喜欢就好
  },
  //聊天信息
  {
    path: '/room/msgList',
    name: 'roomMsgList',
    component: _import('room/msgList'),
    meta: { title: '聊天信息', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:-1} // 定义一些公共状态，你喜欢就好
  }
]
export default roomRouter