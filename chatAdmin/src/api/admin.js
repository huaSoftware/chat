import request from '@/utils/request'

export function adminList(data) {
    return request({
        url: '/api/v2/admin/list',
        method: 'post',
        data
    })
}

export function adminDelete(data) {
    return request({
      url: '/api/v2/admin/delete',
      method: 'get',
      params:data
    })
}

export function adminEdit(data) {
    return request({
      url: '/api/v2/admin/edit',
      method: 'post',
      data
    })
  }
  
  export function adminAdd(data) {
    return request({
      url: '/api/v2/admin/add',
      method: 'post',
      data
    })
  }
  