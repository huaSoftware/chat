/*
 * @Author: hua
 * @Date: 2019-11-04 11:13:25
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-04 13:06:26
 */
import {send} from '@/utils/socketio'

// 获取通讯录列表（群聊）
export function getConst (data) {
    let reqData = {
        'c':'ConfigService',
        'a':'getConst'
    }
    return send('send', reqData, 'api')
}
