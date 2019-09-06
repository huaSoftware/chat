export default {
    state: {
        // 房间类型
        ALONECHAT: 0, //单聊
        GROUPCHAT:1,//群聊
        NOTIFICATION:2,//通知
        // 聊天类型
        RECORD:0,//录音
        TEXT:1,//文字图片文件
        RESEND:2,//重发
        // 发送状态
        LOADING: 0,//发送中
        SUCCESS:1, //成功
        FAIL:2, //失败
        //保存聊天方式
        LOCALSAVE:0,//本地保存
        CLOUDSAVE:1//远端保存
  
    },
    getters:{
      ALONECHAT(state){
        return state.ALONECHAT
      },
      GROUPCHAT(state){
        return state.GROUPCHAT
      },
      NOTIFICATION(state){
        return state.NOTIFICATION
      },
      RECORD(state){
        return state.RECORD
      },
      TEXT(state){
        return state.TEXT
      },
      RESEND(state){
        return state.RESEND
      },
      LOADING(state){
        return state.LOADING
      },
      SUCCESS(state){
        return state.SUCCESS
      },
      FAIL(state){
        return state.FAIL
      },
      LOCALSAVE(state){
        return state.LOCALSAVE
      },
      CLOUDSAVE(state){
        return state.CLOUDSAVE
      }
    }
}  