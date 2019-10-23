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
    formatData.data.msg.match(regStr).map(function(v) {
        formatData.data.msg = formatData.data.msg.replace(v, escape(v).replace(/%/g,"\\"))
    });
    let formatMsgInfo = JSON.parse(JSON.stringify(msgInfo))
    formatMsgInfo.msg.match(regStr).map(function(v) {
        formatMsgInfo.msg = formatMsgInfo.msg.replace(v, escape(v).replace(/%/g,"\\"))
    });
    if(data['data']['save_action'] == 0){
        addLocalRoomMsg(msgInfo)
    }else if(data['data']['save_action'] == 1){
        delete data.data.save_action;
        console.log(msgInfo)
        addCloudRoomMsg(formatMsgInfo)
    }
    console.log("发送",formatData)
    return send('chat', formatData)
}

/**
 * 重新发送消息
 * @param {*} data 
 */
export function reChatSend(data){
    let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
    console.log(data)
    let index = utils.arr.getIndexByTime(data.data['created_at'], msgList)
    console.log(index)
    msgList[index]['send_status'] = 0
    store.dispatch('updateMsgList', msgList)
    //格式化emoji
    let formatData = JSON.parse(JSON.stringify(data))
    formatData.data.msg.match(regStr).map(function(v) {
        formatData.data.msg = formatData.data.msg.replace(v, escape(v).replace(/%/g,"\\"))
    });
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