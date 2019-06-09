import request from '@/utils/request'

// 添加好友接口
export function userRoomRelationGet (data) {
    return request({
        url: '/api/v2/userRoomRelation/get',
        method: 'post',
        data
    })
}