/*
 * @Author: hua
 * @Date: 2020-08-30 21:02:40
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-08-30 21:03:12
 */
import request from '@/utils/request'

/* 获取列表 */
export function userRoomRelationList(data) {
  return request({
    url: '/api/v2/admin/userRoomRelation/list',
    method: 'post',
    data
  })
}

/* 删除 */
export function userRoomRelationDelete(data) {
  /*  return request({
    url: '/api/v2/admin/userRoomRelation/delete',
    method: 'get',
    params:data
  }) */
}
