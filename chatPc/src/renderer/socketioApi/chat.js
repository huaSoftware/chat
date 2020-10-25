/*
 * @Author: hua
 * @Date: 2019-11-19 15:01:33
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-19 15:24:24
 */
import {send} from '@/utils/socketio'


// 获取房间信息接口
export function chatSend (data) {
    let reqData = {
        'c':'ChatService',
        'a':'adminChat',
        'data':data
    }
    return send('send', reqData, 'api')
}