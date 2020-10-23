/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 发送消息接口
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:25:25
 */

import {send} from '@/utils/socketio'
import storage from "@/utils/localstorage"
import store from '../store'
import utils from '@/utils/utils'
import { addLocalRoomMsg } from "@/utils/indexedDB"
import {addCloudRoomMsg } from "@/socketioApi/room"

/**
 * 发送聊天信息
 * @param {*} data 
 */
export function chatSend(data){
    let userInfo = storage.get('user')
    let msgInfo = data.data
    msgInfo['send_status'] = 0
    msgInfo['read_status'] = 0
    msgInfo['name'] = userInfo['nick_name']
    msgInfo['user_id'] =  userInfo['id']
    msgInfo['head_img'] = userInfo['head_img']
    msgInfo['created_at'] = parseInt(new Date().getTime()/1000)
    let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
    msgList = msgList.concat(msgInfo)
    store.dispatch('updateMsgList', msgList)
    //格式化emoji
    var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    let formatData = JSON.parse(JSON.stringify(data))
    let matchData =  formatData.data.msg.match(regStr)
    if(matchData){
        matchData.map(function(v) {
            formatData.data.msg = formatData.data.msg.replace(v, escape(v).replace(/%/g,"\\"))
        });
    }
    let formatMsgInfo = JSON.parse(JSON.stringify(msgInfo))
    let matchMsgInfo =  formatMsgInfo.msg.match(regStr)
    if(matchMsgInfo){
        matchMsgInfo.map(function(v) {
            formatMsgInfo.msg = formatMsgInfo.msg.replace(v, escape(v).replace(/%/g,"\\"))
        });
    }
    if(data['data']['save_action'] == 0){
        addLocalRoomMsg(msgInfo)
    }/* else if(data['data']['save_action'] == 1){
        //delete data.data.save_action;
        delete formatMsgInfo.save_action;
        console.log(msgInfo)
        addCloudRoomMsg(formatMsgInfo)
    } */
    console.log("发送",formatData)
    return send('chat', formatData)
}

/**
 * 重新发送消息
 * @param {*} data 
 */
export function reChatSend(data){
    let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
    let uuid = data.data['room_uuid']+data.data['user_id']+data.data['created_at']
    let index = utils.arr.getIndexByUuid(uuid, msgList)
     //格式化emoji
    var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    msgList[index]['send_status'] = 0
    store.dispatch('updateMsgList', msgList)
    //格式化emoji
    let formatData = JSON.parse(JSON.stringify(data))
    let matchData =  formatData.data.msg.match(regStr)
    if(matchData){
        matchData.map(function(v) {
            formatData.data.msg = formatData.data.msg.replace(v, escape(v).replace(/%/g,"\\"))
        });
    }
    console.log("重发",formatData)
    return send('chat', formatData)
}

/**
 * 加入聊天室
 * @param {*} data 
 */
export function joinChatSend(data){
    return send('join', data)
}