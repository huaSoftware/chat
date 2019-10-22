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
    if(data['data']['save_action'] == 0){
        addLocalRoomMsg(msgInfo)
    }else if(data['data']['save_action'] == 1){
        delete data.data.save_action;
        console.log(msgInfo)
        addCloudRoomMsg(msgInfo)
    }
    console.log("发送",data)
    return send('chat', data)
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
    console.log("重发",data)
    return send('chat', data)
}

/**
 * 加入聊天室
 * @param {*} data 
 */
export function joinChatSend(data){
    return send('join', data)
}