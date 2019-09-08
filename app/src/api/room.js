import request from '@/utils/request'

// 获取房间信息接口
export function roomGet(){
    return request({
        url: '/api/v2/room/get',
        method: 'get'
    })
}

// 删除房间
export function roomDel(data){
    return request({
        url: '/api/v2/room/del',
        method: 'post',
        data
    })
}

//获取房间聊天记录
export function getCloudRoomMsg(data){
    return request({
        url: '/api/v2/room/msg/get',
        method: 'post',
        data
    })
}

//添加房间聊天记录
export function addCloudRoomMsg(data){
    return request({
        url: '/api/v2/room/msg/add',
        method: 'post',
        data
    })
}

//删除房间聊天记录
export function roomMsgDel(data){
    return request({
        url: '/api/v2/room/msg/del',
        method: 'post',
        data
    })
}

//更新房间聊天记录
export function updateCloudRoomMsg(data){
    return request({
        url: '/api/v2/room/msg/update',
        method: 'post',
        data
    })
}