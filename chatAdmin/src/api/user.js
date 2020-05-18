/*
 * @Author: hua
 * @Date: 2019-09-02 11:20:16
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-05-07 11:47:00
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v2/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/v2/admin/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/api/v2/admin/getCode',
    method: 'get'
  })
}

/* 获取用户列表  */
export function userList(data) {
  return request({
    url: '/api/v2/admin/user/list',
    method: 'post',
    data
  })
}
/* 删除用户 */
export function userDelete(data) {
  /* return request({
    url: '/api/v2/admin/user/delete',
    method: 'get',
    params:data
  }) */
}

export function userEdit(data) {
  /* return request({
    url: '/api/v2/admin/user/edit',
    method: 'post',
    data
  }) */
}

export function userAdd(data) {
  /*  return request({
    url: '/api/v2/admin/user/add',
    method: 'post',
    data
  }) */
}

export function index() {
  return request({
    url: '/api/v2/admin/index',
    method: 'get'
  })
}

