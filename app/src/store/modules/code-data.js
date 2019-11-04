export default {
    state: {
      "CHAT":{
          "RECORD":{
              "text":"录音",
              "value": 0
          },
          "TEXT":{
              "text":"文字",
              "value": 1
          },
          "IMG":{
              "text":"图片",
              "value": 2
          },
          "FILE":{
              "text":"文件",
              "value": 3
          }
      },
      "LOG":{
          "NORMAL":{
              "text":"普通日志",
              "value": 0
          },
          "DEBUG":{
              "text":"调试日志",
              "value": 1
          },
          "WARN":{
              "text":"警告日志",
              "value": 2
          },
          "ERROR":{
              "text":"错误日志",
              "value": 3
          }
      },
      "ROOM":{
          "ALONE":{
              "text":"单聊",
              "value": 0
          },
          "GROUP":{
              "text":"群聊",
              "value": 1
          },
          "NOTIFY":{
              "text":"通知",
              "value": 2
          }
      },
      "SAVE":{
          "LOCAL":{
              "text":"本地存储",
              "value": 0
          },
          "CLOUD":{
              "text":"远端存储",
              "value": 1
          }
      },
      "STATUS":{
          "LOADING":{
              "text":"发送中",
              "value": 0
          },
          "SUCCESS":{
              "text":"发送成功",
              "value": 1
          },
          "FAIL":{
              "text":"发送失败",
              "value": 2
          },
          "RESEND":{
              "text":"重新发送",
              "value": 3
          }
      },
      "ADDFRIEND":{
        "APPLY":{
          "text":"申请",
          "value": 0
        },
        "PASS":{
          "text":"通过",
          "value": 1
        },
        "REFUSE":{
          "text":"拒绝",
          "value": 2
        }
      }
    },
    getters:{
      APPLY(state){
        return state.ADDFRIEND.APPLY.value
      },
      PASS(state){
        return state.ADDFRIEND.PASS.value
      },
      REFUSE(state){
        return state.ADDFRIEND.REFUSE.value
      },
      ALONE(state){
        return state.ROOM.ALONE.value
      },
      GROUP(state){
        return state.ROOM.GROUP.value
      },
      NOTIFY(state){
        return state.ROOM.NOTIFY.value
      },
      RECORD(state){
        return state.CHAT.RECORD.value
      },
      TEXT(state){
        return state.CHAT.TEXT.value
      },
      RESEND(state){
        return state.STATUS.RESEND.value
      },
      IMG(state){
        return state.CHAT.IMG.value
      },
      FILE(state){
        return state.CHAT.FILE.value
      },
      LOADING(state){
        return state.STATUS.LOADING.value
      },
      SUCCESS(state){
        return state.STATUS.SUCCESS.value
      },
      FAIL(state){
        return state.STATUS.FAIL.value
      },
      LOCAL(state){
        return state.SAVE.LOCAL.value
      },
      CLOUD(state){
        return state.SAVE.CLOUD.value
      }
    },
    mutations: {
      //修改仓库值
      updateChat(state, chat){
        state.CHAT = chat
      },
      updateLog(state, log){
        state.log =  log
      },
      updateRoom(state, room){
        state.room = room
      },
      updateSave(state, save){
        state.save =  save
      },
      updateStatus(state, status){
        state.status = status
      },
      updateAddFriend(state, addFriend){
        state.ADDFRIEND = addFriend
      }
    }
}  