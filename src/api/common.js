import request from '@/utils/request'

//上传图片base64
export function uploadBase64(data){
    return request({
        url: '/v2.api/uploadBase64',
        method: 'post',
        data: data
    })
}

//上传文件
export function uploadFile(data){
    return request({
        url: '/v2.api/upload',
        method: 'post',
        data
    })
}