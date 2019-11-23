/*
 * @Author: hua
 * @Date: 2019-11-21 17:20:24
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-22 11:16:06
 */
import request from '@/utils/request'

/* 获取列表 */
export function configList(data) {
    return request({
        url: '/api/v2/config/list',
        method: 'post',
        data
    })
}

/* 删除 */
export function configDelete(data) {
    return request({
      url: '/api/v2/config/delete',
      method: 'get',
      params:data
    })
}

/* 编辑列表 */
export function configEdit(data) {
    return request({
      url: '/api/v2/config/edit',
      method: 'post',
      data
    })
  }
  
/* 添加列表 */
export function configAdd(data) {
  return request({
    url: '/api/v2/config/add',
    method: 'post',
    data
  })
}
