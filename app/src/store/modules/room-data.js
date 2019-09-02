/**
 * 作者：hua
 * 时间：2019-03-15
 * 聊天数据临时管理
 */
import { getRoomMsg, addLocalRoomMsg } from "@/utils/indexedDB"
import utils from '@/utils/utils'
export default {
    state: {
        currentRoomUuid: '',//当前房间号
        currentRoomName: '',//房间名
        currentRoomType:0,//房间类型
        currentRoomSaveAction: 0, //聊天记录保存方式   
        msgAlertNumber:0,//单聊消息总提醒       
        groupMsgAlertNumber:0,//群聊天消息总提醒            
        msgList: [],//聊天数据
        roomList: [],//单聊房间数据 
        groupRoomList: [] //群聊房间数据

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
        msgAlertNumber(state){
            return state.msgAlertNumber
        },
        groupMsgAlertNumber(state){
            return state.groupMsgAlertNumber
        },
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
            commit("updateCurrentRoomType", currentRoomSaveAction);
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
                if(item.save_action == 0){
                    //读取最近10条进行对比,不存在则添加
                    getRoomMsg(item.room_uuid,1, 10).then(res => {
                        let index = utils.arr.getIndexByTime(item['created_at'], res)
                        if(typeof index == 'undefined' && item.room.last_msg !== ''){
                            let msgData = {
                                msg:item.room.last_msg,
                                created_at:item.created_at,
                                head_img:item.users.head_img,
                                name:item.users.nick_name,
                                id:item.id,
                                save_action:item.save_action,
                                send_status:1,
                                type:item.users.nick_name,
                                user_id:item.users.id,
                                room_uuid:item.room_uuid
                            }
                            addLocalRoomMsg(msgData)
                        }
                    })
                }
                unread_number = unread_number+item.unread_number
            })
            state.msgAlertNumber = unread_number
        },
        updateGroupRoomList(state, groupRoomList){
            state.groupRoomList = groupRoomList
            //非云端状态下把最后一条聊天记录保存到本地
            let unread_number = 0
            groupRoomList.forEach((item)=>{
                if(item.save_action == 0){
                    //读取最近10条进行对比,不存在则添加
                    getRoomMsg(item.room_uuid,1, 10).then(res => {
                        let index = utils.arr.getIndexByTime(item['created_at'], res)
                        if(typeof index == 'undefined' && item.room.last_msg !== ''){
                            let msgData = {
                                msg:item.room.last_msg,
                                created_at:item.created_at,
                                head_img:item.users.head_img,
                                name:item.users.nick_name,
                                id:item.id,
                                save_action:item.save_action,
                                send_status:1,
                                type:item.users.nick_name,
                                user_id:item.users.id,
                                room_uuid:item.room_uuid
                            }
                            addLocalRoomMsg(msgData)
                            unread_number = unread_number+item.unread_number
                        }
                    })
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
        }
    }
}
