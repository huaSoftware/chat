/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 房间数据管理
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:29:11
 */

import { addLocalRoomMsg } from "@/utils/indexedDB"

export default {
    state: {
        currentRoomUuid: '',//当前房间号
        currentRoomName: '',//房间名
        currentRoomType:0,//房间类型
        currentRoomSaveAction: 0, //聊天记录保存方式   
        msgAlertNumber:0,//单聊消息总提醒       
        groupMsgAlertNumber:0,//群聊天消息总提醒 
        newFriendAlertNumber:0,//新好友提醒           
        msgList: [],//聊天数据
        roomList: [],//单聊房间数据 
        groupRoomList: [], //群聊房间数据
        isPaused:false,
        msg:""//@聊天数据
    },
    getters:{
        msgList(state){
            return state.msgList
        },
        roomList(state){
            return state.roomList
        },
        groupRoomList(state){
            return state.groupRoomList
        },
        currentRoomUuid(state){
            return state.currentRoomUuid
        },
        currentRoomName(state){
            return state.currentRoomName
        },
        currentRoomType(state){
            return state.currentRoomType
        },
        currentRoomSaveAction(state){
            return state.currentRoomSaveAction
        },
        currentRoomInput(state){
            return state.currentRoomInput
        },
        msgAlertNumber(state){
            return state.msgAlertNumber
        },
        groupMsgAlertNumber(state){
            return state.groupMsgAlertNumber
        },
        newFriendAlertNumber(state){
            return state.newFriendAlertNumber
        },
        isPaused(state){
            return state.isPaused
        },
        msg(state){
            return state.msg
        }
    },

    actions: {
        //提交穿过来的参数 以及突变给mutations
        updateMsgList({commit}, msgList) {
            commit("updateMsgList", msgList);
        },
        updateRoomList({commit}, roomList) {
            commit("updateRoomList", roomList);
        },
        updateGroupRoomList({commit}, groupRoomList) {
            commit("updateGroupRoomList", groupRoomList);
        },
        updateCurrentRoomUuid({commit}, currentRoomUuid){
            commit("updateCurrentRoomUuid", currentRoomUuid);
        },
        updateCurrentRoomName({commit}, currentRoomName){
            commit("updateCurrentRoomName", currentRoomName);
        },
        updateCurrentRoomType({commit}, currentRoomType){
            commit("updateCurrentRoomType", currentRoomType);
        },
        updateCurrentRoomSaveAction({commit}, currentRoomSaveAction){
            commit("currentRoomSaveAction", currentRoomSaveAction);
        },
        updateNewFriendAlertNumber({commit}, newFriendAlertNumber){
            commit("updateNewFriendAlertNumber", newFriendAlertNumber);
        },
        updateMsg({commit}, msg){
            commit("updateMsg", msg);
        } 
        
    },

    mutations: {
        //修改仓库值
        updateMsgList(state, msgList){
            state.msgList = msgList
        },
        updateRoomList(state, roomList){
            state.roomList = roomList
            //非云端状态下把最后一条聊天记录保存到本地
            let unread_number = 0
            roomList.forEach((item)=>{
                if(item.room.last_msg !=''){
                    let data = JSON.parse(item.room.last_msg)
                    if(item.save_action == 0){
                        let msgData = {
                            msg:data['msg'],
                            created_at:data.created_at,
                            head_img:data['head_img'],
                            name:data['name'],
                            send_status:1,
                            type:data['type'],
                            user_id:data['user_id'],
                            room_uuid:item.room_uuid
                        }
                        addLocalRoomMsg(msgData)
                    }/* else if(item.save_action == 1){
                        let msgData = {
                            msg:data['msg'],
                            created_at:item.room.updated_at,
                            head_img:data['head_img'],
                            name:data['name'],
                            send_status:1,
                            type:data['type'],
                            user_id:data['user_id'],
                            room_uuid:item.room_uuid
                        }
                        console.log(msgData)
                        addCloudRoomMsg(msgData)
                    } */
                    if(item.is_alert){
                        unread_number = unread_number+item.unread_number
                    }
                }
            })
            state.msgAlertNumber = unread_number
        },
        updateGroupRoomList(state, groupRoomList){
            state.groupRoomList = groupRoomList
            //非云端状态下把最后一条聊天记录保存到本地
            let unread_number = 0
            console.log("342342",groupRoomList)
            groupRoomList.forEach((item)=>{
                if(item.room.last_msg !=''){
                    console.log(item.room.last_msg)
                    let data = JSON.parse(item.room.last_msg)
                    if(item.save_action == 0){
                        let msgData = {
                            msg:data['msg'],
                            created_at:data.created_at,
                            head_img:data.head_img,
                            name:data.name,
                            send_status:1,
                            type:data['type'],
                            user_id:data.user_id,
                            room_uuid:item.room_uuid
                        }
                        addLocalRoomMsg(msgData)      
                    }
                    
                    /* else if(item.save_action == 1){
                        let msgData = {
                            msg:data['msg'],
                            created_at:item.created_at,
                            head_img:item.users.head_img,
                            name:item.users.nick_name,
                            send_status:1,
                            type:data['type'],
                            user_id:item.users.id,
                            room_uuid:item.room_uuid
                        }
                        addCloudRoomMsg(msgData)
                    } */
                    if(item.is_alert){
                        unread_number = unread_number+item.unread_number
                    }
                }
            })
            state.groupMsgAlertNumber = unread_number
        },
        updateCurrentRoomUuid(state, currentRoomUuid){
            state.currentRoomUuid = currentRoomUuid
        },
        updateCurrentRoomName(state, currentRoomName){
            state.currentRoomName = currentRoomName
        },
        updateCurrentRoomType(state, currentRoomType){
            state.currentRoomType = currentRoomType
        },
        updateCurrentRoomSaveAction(state, currentRoomSaveAction){
            state.currentRoomSaveAction = currentRoomSaveAction
        },
        updateMsgAlertNumber(state, msgAlertNumber){
            state.msgAlertNumber = msgAlertNumber
        },
        updateNewFriendAlertNumber(state, newFriendAlertNumber){
            state.newFriendAlertNumber = newFriendAlertNumber
        },
        updateIsPaused(state, data){
            state.isPaused = data
        },
        updateMsg(state, msg){
            state.msg = msg
        }
    }
}
