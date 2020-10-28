/*
 * @Author: hua
 * @Date: 2019-09-27 15:27:50
 * @description: 公共接口
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:09:50
 */

import {send} from '@/utils/socketio'

//上传图片
export function uploadBase64 (data) {
    let reqData = {
        'c':'UploadService',
        'a':'uploadBase64',
        'data':data
    }
    return send('send', reqData, 'api')
}

//上传文件
export function uploadFile(data){
    let reqData = {
        'c':'UploadService',
        'a':'upload',
        'data':data
    }
    return send('send', reqData, 'api')
}