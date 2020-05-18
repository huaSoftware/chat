import request from '@/utils/request'

/* 获取通讯录列表 */
export function addressBookList(data) {
  return request({
    url: '/api/v2/admin/addressBook/list',
    method: 'post',
    data
  })
}

/* 删除通讯录 */
export function addressBookDelete(data) {
  /*  return request({
    url: '/api/v2/admin/addressBook/delete',
    method: 'get',
    params:data
  }) */
}
