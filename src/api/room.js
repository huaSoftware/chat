import request from '@/utils/request'

// 获取通讯录接口
export function roomGet(data){
    return request({
        url: '/api/v2/room/get',
        method: 'post',
        data
    })
}
