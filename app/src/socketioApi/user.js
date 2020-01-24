/*
 * @Author: hua
 * @Date: 2019-09-27 15:27:50
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-01-23 21:50:10
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
