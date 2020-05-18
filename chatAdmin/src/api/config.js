/*
 * @Author: hua
 * @Date: 2019-11-21 17:20:24
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-05-07 11:47:44
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
  /*  return request({
    url: '/api/v2/config/delete',
    method: 'get',
    params: data
  }) */
}

/* 编辑列表 */
export function configEdit(data) {
  /*  return request({
    url: '/api/v2/config/edit',
    method: 'post',
    data
  }) */
}

/* 添加列表 */
export function configAdd(data) {
  /*  return request({
    url: '/api/v2/config/add',
    method: 'post',
    data
  }) */
}

/* 获取JSON配置列表 */
export function configConstJson(data) {
  return request({
    url: '/api/v2/configConstJson',
    method: 'post'
  })
}

/* 修改JSON配置列表 */
export function configConstJsonEdit(data) {
  /*  return request({
    url: '/api/v2/configConstJson/edit',
    method: 'post',
    data
  }) */
}

