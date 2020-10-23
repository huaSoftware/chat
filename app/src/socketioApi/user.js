/*
 * @Author: hua
 * @Date: 2019-09-27 15:27:50
 * @description: 用户接口
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:26:27
 */

import {send} from '@/utils/socketio'

// 登录接口
export function login (data) {
    let reqData = {
        'c':'UsersService',
        'a':'login',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 注册接口
export function register(data) {
    let reqData = {
        'c':'UsersService',
        'a':'register',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 用户信息
export function userInfo(){
    let reqData = {
        'c':'UsersService',
        'a':'get'
    }
    return send('send', reqData, 'api')
}
