/**
 * 作者：hua
 * 时间：2019-03-15
 * 聊天数据临时管理
 */
export default {
    state: {
        currentRoomUuid: '',//当前房间号
        currentRoomName: '',//房间名
        currentRoomType:0,//房间类型
        currentRoomSaveAction: 0, //聊天记录保存方式               
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
        },
        updateGroupRoomList(state, groupRoomList){
            state.groupRoomList = groupRoomList
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
        }
    }
}
