/*
 * @Author: hua
 * @Date: 2019-12-30 20:23:23
 * @description: 有权限socketio监听事件
 * @LastEditors: hua
 * @LastEditTime: 2020-08-17 21:13:10
 */
import store from "../store";
import router from "../router";
import { MessageBox, Message } from "element-ui";
import {
  send,
  response,
  modifyMsgStatus,
  modifyMsgReadStatus,
  formatLastMsg
} from "@/utils/socketio";
import {
  addLocalRoomMsg,
  updateLocalRoomMsg,
  getAddressBookBeg,
  updateReadStatusLocalRoomMsgByRoomIdAndUserId
} from "@/utils/indexedDB";
import {
  updateCloudRoomMsg,
  updateReadStatusCloudRoomMsgByRoomIdAndUserId
} from "@/socketioApi/room";
/*
 * 有权限socketio监听事件
 */
export default function setupAuthEvent() {
  window.apiSocket.on("adminJoin", data => {
    //逻辑处理
  });
  window.apiSocket.on("adminLeave", data => {
    //逻辑处理
  });
  window.apiSocket.on("send", data => {
    //逻辑处理
  });
  /*  window.apiSocket.on("input", data => {
    //用户输入时逻辑处理
    response(data).then(res => {
      let data = res.data;
      if (
        data.even == "focus" &&
        store.getters.currentRoomType == 0 &&
        store.getters.currentRoomUuid == data.room_uuid &&
        data.users.id != store.getters.userInfo.id
      ) {
        document.getElementsByClassName(
          "yd-navbar-center-title"
        )[0].innerHTML = `${data.users.nick_name}正在输入...`;
        //更新房间对方信息是已读
        if (store.getters.currentRoomSaveAction == store.getters.LOCAL) {
          updateReadStatusLocalRoomMsgByRoomIdAndUserId(
            data.room_uuid,
            data.be_users.id
          );
          modifyMsgReadStatus();
        } else if (store.getters.currentRoomSaveAction == store.getters.CLOUD) {
          //updateCloudRoomMsg(reqData)
          console.log("432432", data);
          updateReadStatusCloudRoomMsgByRoomIdAndUserId(
            data.room_uuid,
            data.be_users.id
          );
          modifyMsgReadStatus();
        }
      } else {
        document.getElementsByClassName(
          "yd-navbar-center-title"
        )[0].innerHTML = `${data.users.nick_name}`;
      }
    });
  }); */
  ///监听回复的消息
  window.apiSocket.on("chat", data => {
    console.log(234234244242423);
    // 回复根据标志分类todo
    response(data).then(res => {
      let data = res.data;
      //逻辑处理,存放indexdDB,存放一份实时的在vuex
      console.log("发送消息监听回复", data);
      let index = modifyMsgStatus(data, store.getters.SUCCESS);
      let msgList = JSON.parse(JSON.stringify(store.getters.msgList));
      //这边会有发送后接收不到的问题
      if (typeof index !== "undefined") {
        msgList[index]["send_status"] = store.getters.SUCCESS;
        //他人发送的需要根据设置的房间状态去同步聊天数据
        delete msgList[index]["id"];
        console.log("消息列表", msgList[index]);
        if (store.getters.currentRoomSaveAction == store.getters.LOCAL) {
          console.log(msgList[index]);
          addLocalRoomMsg(msgList[index]);
        }
      } else {
        msgList = msgList.concat(data);
      }
      store.dispatch("updateMsgList", msgList);
      let reqData = {
        room_uuid: data["room_uuid"],
        created_at: data["created_at"],
        user_id: data["user_id"],
        send_status: store.getters.SUCCESS
      };
      /* if (store.getters.currentRoomSaveAction == store.getters.LOCAL) {
        updateLocalRoomMsg(reqData);
      } else if (store.getters.currentRoomSaveAction == store.getters.CLOUD) {
        updateCloudRoomMsg(reqData);
      } */
      //@通知
      if (data["type"] == store.getters.CHAT_NOTIFY) {
        let msg = formatLastMsg(data["msg"]);
        if (msg["user"]["id"] == store.getters.userInfo.id) {
          //同步信息到vuex
          store.dispatch("updateMsg", msg);
          /* plus.push.createMessage(msg["msg"], "LocalMSG", {
            cover: false,
            title: msg["user"]["nick_name"]
          }); */
        }
      }
    });
  });
  //监听
  send("adminJoin", {}, "broadcast");
  //更新在线状态
  /* if (!window.loginConnectInterval) {
    window.loginConnectInterval = setInterval(() => {
      send("loginConnect", {}, "loginConnect");
    }, store.getters.TIME.TIME_OUT.value); //超时时间动态设置
  } */
  //如果当前存在房间则进入
  if (
    store.getters.currentRoomUuid !== "" &&
    store.getters.currentRoomName !== ""
  ) {
    send("adminJoin", {
      name: store.getters.currentRoomName,
      room_uuid: store.getters.currentRoomUuid,
      type: store.getters.currentRoomType,
      save_action: store.getters.currentRoomSaveAction
    });
  }

  //监听单聊房间动态消息
  window.apiSocket.on("room", data => {
    response(data)
      .then(res => {
        console.log(24234235, res);
        let data = res.data.list;
        if (data != null) {
          //app消息通知
          if (store.getters.isPaused && data[0].is_alert) {
            /* plus.push.createMessage(
              formatLastMsg(data[0]["room"]["last_msg"]),
              "LocalMSG",
              { cover: false, title: data[0].users.nick_name }
            ); */
            if (window.webkitNotifications.checkPermission() == 0) {
              window.webkitNotifications.createNotification(
                "", //icon
                "您有一条新消息",
                data[0].users.nick_name
              );
            } else {
              Message({
                message: "您有一条新消息",
                type: "info",
                duration: 5 * 1000
              });
            }
          }
          console.log(24234234, data);
          store.dispatch("updateRoomList", data);
        }
      })
      .catch(e => {
        console.log(24234234, e);
      });
  });
}
