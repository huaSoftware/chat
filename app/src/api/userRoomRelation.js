import request from '@/utils/request'

// 获取通讯录列表（群聊）
export function userRoomRelationGet () {
    return request({
        url: '/api/v2/userRoomRelation/get',
        method: 'get'
    })
}

// 获取群聊房间信息通过房间uuid
export function userRoomRelationGetByRoomUuid(data){
    return request({
        url: '/api/v2/userRoomRelation/getByRoomUuid',
        method: 'post',
        data
    })
}

//更新对否提醒
export function userRoomRelationUpdateAlert(data){
    return request({
        url:'/api/v2/userRoomRelation/updateAlert',
        method: 'post',
        data
    })
}