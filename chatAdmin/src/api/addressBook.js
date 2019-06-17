import request from '@/utils/request'

export function addressBookList(data) {
  return request({
    url: '/api/v2/admin/addressBook/list',
    method: 'post',
    data
  })
}

export function addressBookDelete(data) {
  return request({
    url: '/api/v2/admin/addressBook/delete',
    method: 'get',
    params:data
  })
}
