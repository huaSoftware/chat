/*
 * @Author: hua
 * @Date: 2019-09-29 14:25:37
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-04 11:14:16
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