import request from '@/utils/request'

// 获取房间信息接口
export function roomGet(data){
    return request({
        url: '/api/v2/room/get',
        method: 'post',
        data
    })
}
