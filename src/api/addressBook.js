import request from '@/utils/request'

// 添加好友接口
export function addressBookAdd (data) {
    return request({
        url: '/api/v2/addressBook/add',
        method: 'post',
        data
    })
}

// 获取通讯录接口
export function addressBookGet(data){
    return request({
        url: '/api/v2/addressBook/get',
        method: 'post',
        data
    })
}

// 发送添加好友请求
export function addressBookBeg(data){
    return request({
        url: '/api/v2/addressBook/beg',
        method: 'post',
        data
    })
}