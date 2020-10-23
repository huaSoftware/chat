/*
 * @Author: hua
 * @Date: 2020-02-27 18:48:10
 * @description: 群聊路由模块
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:23:56
 */
const _import = require('../_import_' + process.env.NODE_ENV)

const groupRoomRouter = [
   //房间
   {
    path: '/groupRoom',
    name: 'groupRoom',
    component: _import('groupRoom/groupRoom'),
    meta: { title: '房间', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'home', isShowDef:true, defTextName:'详情', defPath:'roomDetails'} // 定义一些公共状态，你喜欢就好
  },
  //房间详情
  {
    path: '/groupRoom/details',
    name: 'groupRoomDetails',
    component: _import('groupRoom/details'),
    meta: { title: '房间详情', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:-1} // 定义一些公共状态，你喜欢就好
  },
  //聊天信息
  {
    path: '/groupRoom/msgList',
    name: 'groupRoomMsgList',
    component: _import('groupRoom/msgList'),
    meta: { title: '聊天信息', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:-1} // 定义一些公共状态，你喜欢就好
  }
]
export default groupRoomRouter