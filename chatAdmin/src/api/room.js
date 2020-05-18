/*
 * @Author: hua
 * @Date: 2019-09-02 11:20:16
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-05-07 11:46:38
 */
import request from '@/utils/request'

/* 获取房间列表 */
export function roomList(data) {
  return request({
    url: '/api/v2/admin/room/list',
    method: 'post',
    data
  })
}

/* 删除房间 */
export function roomDelete(data) {
  /* return request({
    url: '/api/v2/admin/room/delete',
    method: 'get',
    params:data
  }) */
}

/* 获取聊天信息 */
export function msgGet(data) {
  return request({
    url: '/api/v2/admin/msg/get',
    method: 'post',
    data
  })
}
