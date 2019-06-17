import request from '@/utils/request'
// 搜索用户接口
export function search (data) {
    return request({
        url: '/api/v2/search',
        method: 'post',
        data
    })
}