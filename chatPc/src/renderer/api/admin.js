import request from '@/utils/request'

/* 获取管理员列表 */
export function adminList(data) {
    return request({
        url: '/api/v2/admin/list',
        method: 'post',
        data
    })
}

/* 删除管理员列表 */
export function adminDelete(data) {
    return request({
      url: '/api/v2/admin/delete',
      method: 'get',
      params:data
    })
}

/* 编辑管理员列表 */
export function adminEdit(data) {
    return request({
      url: '/api/v2/admin/edit',
      method: 'post',
      data
    })
  }
  
/* 添加管理员列表 */
export function adminAdd(data) {
  return request({
    url: '/api/v2/admin/add',
    method: 'post',
    data
  })
}
