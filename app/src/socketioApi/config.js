/*
 * @Author: hua
 * @Date: 2019-11-04 11:13:25
 * @description: 配置接口
 * @LastEditors: hua
 * @LastEditTime: 2019-11-07 15:10:43
 */
import {send} from '@/utils/socketio'

// 获取常量配置
export function getConst () {
    let reqData = {
        'c':'ConfigService',
        'a':'getConst'
    }
    return send('send', reqData, 'api')
}

// 提交错误日志
export function logAdd (data) {
    let reqData = {
        'c':'LogService',
        'a':'clientAdd',
        'data':data
    }
    return send('send', reqData, 'api')
}