import request from '@/utils/request'

// 创建群聊
export function groupChatCreate (data) {
    return request({
        url: '/api/v2/groupChat/create',
        method: 'post',
        data
    })
}