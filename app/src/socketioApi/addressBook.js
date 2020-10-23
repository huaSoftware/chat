/*
 * @Author: hua
 * @Date: 2019-09-27 15:27:50
 * @description: 通讯录接口
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:44:52
 */

import {send} from '@/utils/socketio'

// 添加好友接口
export function addressBookAdd (data) {
    let reqData = {
        'c':'AddressBookService',
        'a':'add',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 获取通讯录接口
export function addressBookGet(data){
    let reqData = {
        'c':'AddressBookService',
        'a':'get',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 发送添加好友请求
export function addressBookBeg(data){
    let reqData = {
        'c':'AddressBookService',
        'a':'beg',
        'data':data
    }
    return send('send', reqData, 'api')
}

//获取请求好友离线缓存
export function addressBookBegCache(){
    let reqData = {
        'c':'AddressBookService',
        'a':'begCache'
    }
    return send('send', reqData, 'api')
}

//删除请求好友离线缓存
export function addressBookBegCacheDel(){
    let reqData = {
        'c':'AddressBookService',
        'a':'begCacheDel'
    }
    return send('send', reqData, 'api')
}