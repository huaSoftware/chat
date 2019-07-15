import request from '@/utils/request'

// 获取房间信息接口
export function roomGet(){
    return request({
        url: '/api/v2/room/get',
        method: 'get'
    })
}
