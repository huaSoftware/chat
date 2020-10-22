/*
 * @Author: hua
 * @Date: 2019-09-27 15:27:50
 * @description: 查询接口
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:10:19
 */

import {send} from '@/utils/socketio'

// 搜索用户接口
export function search (data) {
    let reqData = {
        'c':'UsersService',
        'a':'search',
        'data':data
    }
    return send('send', reqData, 'api')
}
