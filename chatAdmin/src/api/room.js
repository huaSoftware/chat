import request from '@/utils/request'

export function roomList(data) {
  return request({
    url: '/api/v2/admin/room/list',
    method: 'post',
    data
  })
}

export function roomDelete(data) {
  return request({
    url: '/api/v2/admin/room/delete',
    method: 'get',
    params:data
  })
}
