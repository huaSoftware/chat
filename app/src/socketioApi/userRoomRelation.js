/*
 * @Author: hua
 * @Date: 2019-09-29 14:25:37
 * @description: 用户房间关系接口
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:11:01
 */

import {send} from '@/utils/socketio'

// 获取通讯录列表（群聊）
export function userRoomRelationGet (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'get',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 获取群聊房间信息通过房间uuid
export function userRoomRelationGetByRoomUuid (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'getByRoomUuid',
        'data':data
    }
    return send('send', reqData, 'api')
}

//更新对否提醒
export function userRoomRelationUpdateAlert(data){
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'updateAlert',
        'data':data
    }
    return send('send', reqData, 'api')
}

//更新是否云端保存
export function userRoomRelationUpdateSaveAction(data){
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'updateSaveAction',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 创建群聊
export function groupChatCreate (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'create',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 添加管理员
export function addManage (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'addManage',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 禁言
export function blockGroupByUserId (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'blockGroupByUserId',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 解除禁言
export function activeGroupByUserId (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'activeGroupByUserId',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 删除用户
export function deleteGroupByUserId (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'deleteGroupByUserId',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 添加用户
export function addGroupByUserId (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'addGroupByUserId',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 获取当前用户群聊信息状态
export function userRoomRelationByUserId (data) {
    let reqData = {
        'c':'UserRoomRelationService',
        'a':'userRoomRelationByUserId',
        'data':data
    }
    return send('send', reqData, 'api')
}