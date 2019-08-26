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
  return request({
    url: '/api/v2/admin/room/delete',
    method: 'get',
    params:data
  })
}
