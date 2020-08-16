/*
 * @Author: hua
 * @Date: 2019-12-30 20:23:23
 * @description: 有权限socketio监听事件
 * @LastEditors: hua
 * @LastEditTime: 2020-08-16 10:39:21
 */
import store from "../store";
import router from "../router";
import { Confirm, Toast } from "vue-ydui/dist/lib.rem/dialog";
import {
  send,
  response,
  modifyMsgStatus,
  modifyMsgReadStatus,
  formatLastMsg,
} from "@/utils/socketio";
import {
  addLocalRoomMsg,
  addAddressBookBeg,
  updateLocalRoomMsg,
  getAddressBookBeg,
  updateAddressBookBeg,
  updateReadStatusLocalRoomMsgByRoomIdAndUserId,
} from "@/utils/indexedDB";
import {
  updateCloudRoomMsg,
  updateReadStatusCloudRoomMsgByRoomIdAndUserId,
} from "@/socketioApi/room";
import { addressBookBegCacheDel } from "@/socketioApi/addressBook";
/*
 * 有权限socketio监听事件
 */
export default function setupAuthEvent() {
  window.apiSocket.on("join", (data) => {
    //逻辑处理
  });
  window.apiSocket.on("leave", (data) => {
    //逻辑处理
  });
  window.apiSocket.on("send", (data) => {
    //逻辑处理
  });
  window.apiSocket.on("input", (data) => {
    //用户输入时逻辑处理
    response(data).then((res) => {
      let data = res.data;
      if (
        data.even == "focus" &&
        store.getters.currentRoomType == 0 &&
        store.getters.currentRoomUuid == data.room_uuid &&
        data.users.id != store.getters.userInfo.id &&
        data.type == 0
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
  });
  ///监听回复的消息
  window.apiSocket.on("chat", (data) => {
    // 回复根据标志分类todo
    response(data).then((res) => {
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
        send_status: store.getters.SUCCESS,
      };
      if (store.getters.currentRoomSaveAction == store.getters.LOCAL) {
        updateLocalRoomMsg(reqData);
      } else if (store.getters.currentRoomSaveAction == store.getters.CLOUD) {
        updateCloudRoomMsg(reqData);
      }
      //@通知
      if (data["type"] == store.getters.CHAT_NOTIFY) {
        let msg = formatLastMsg(data["msg"]);
        if (msg["user"]["id"] == store.getters.userInfo.id) {
          //同步信息到vuex
          store.dispatch("updateMsg", msg);
          plus.push.createMessage(msg["msg"], "LocalMSG", {
            cover: false,
            title: msg["user"]["nick_name"],
          });
        }
      }
    });
  });
  //监听
  send("join", {}, "broadcast");
  //更新在线状态
  if (!window.loginConnectInterval) {
    window.loginConnectInterval = setInterval(() => {
      send("loginConnect", {}, "loginConnect");
    }, store.state.codeData.TIME.TIME_ONLINE_INTERVAL.value); //超时时间动态设置
  }
  //如果当前存在房间则进入
  if (
    store.getters.currentRoomUuid !== "" &&
    store.getters.currentRoomName !== ""
  ) {
    send("join", {
      name: store.getters.currentRoomName,
      room_uuid: store.getters.currentRoomUuid,
      type: store.getters.currentRoomType,
      save_action: store.getters.currentRoomSaveAction,
    });
  }
  //监听好友请求
  window.apiSocket.on("beg", (data) => {
    response(data).then((res) => {
      let data = res.data;
      if (data["action"] == "beg_add") {
        // 复制原来的值
        data["data"]["user_id"] = data["data"]["id"];
        // 删除原来的键
        delete data["data"]["id"];
        // 增加状态,0申请，1通过，2拒绝
        data["data"]["status"] = store.getters.APPLY;
        Toast({ mes: `${data.data.nick_name}申请加你好友` });
        //app消息通知
        if (window.plus && store.getters.isPaused) {
          plus.push.createMessage(
            `${data.data.nick_name}申请加你好友`,
            "LocalMSG",
            { cover: false, title: data.data.nick_name }
          );
        }
        console.log(data);
        //接收到后删除缓存
        addressBookBegCacheDel();
        addAddressBookBeg(data["data"]);
        getAddressBookBeg().then((res) => {
          let newFriendAlertNumber = 0;
          res.forEach((item) => {
            if (item.status == 0) {
              newFriendAlertNumber++;
            }
          });
          store.commit("updateNewFriendAlertNumber", newFriendAlertNumber);
        });
      }
      if (data["action"] == "beg_success") {
        Toast({ mes: "发送成功，对方已收到申请" });
      }
      if (data["action"] == "beg_add_success") {
        Toast({ mes: `${data["nick_name"]}已同意添加好友` });
        updateAddressBookBeg(data["focused_user_id"], 1);
        router.push({
          name: "home",
        });
      }
      if (data["action"] == "invite") {
        console.log("延时推送任务咨询是否需要联系作者");
        Confirm({
          title: "提示",
          mes: "是否有问题需要反馈?点确认自动咨询作者！",
          opts: [
            {
              txt: "取消",
              color: false,
              callback: () => {},
            },
            {
              txt: "确定",
              color: true,
              callback: () => {
                if (window.plus) {
                  plus.runtime.openURL(
                    "http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes"
                  );
                } else {
                  window.open(
                    "http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes"
                  );
                }
              },
            },
          ],
        });
      }
    });
  });
  window.apiSocket.on("video", (data) => {
    console.log('视频接收',data.data);
    var mediaSource = new MediaSource();
    const remotevideo = document.getElementById("remotevideo");
    remotevideo.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen);
    function sourceOpen () {
      this.readyState;
      var mediaSource = this;
      var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs=opus,vp8');
    
      sourceBuffer.addEventListener('updateend', function () {
        mediaSource.endOfStream();
        remotevideo.play();
        console.log(mediaSource.readyState); // ended
      });
      sourceBuffer.appendBuffer(data.data.blob);
    };
  })
  //监听视频
  //监听单聊房间动态消息
  window.apiSocket.on("room", (data) => {
    console.log(24234235, data);
    response(data)
      .then((res) => {
        console.log(24234235, res);
        let data = res.data.list;
        if (data != null) {
          //app消息通知
          if (window.plus && store.getters.isPaused && data[0].is_alert) {
            plus.push.createMessage(
              formatLastMsg(data[0]["room"]["last_msg"]),
              "LocalMSG",
              { cover: false, title: data[0].users.nick_name }
            );
          }
          //H5消息通知
          if (!window.plus && store.getters.isPaused && data[0].is_alert) {
            if (window.webkitNotifications.checkPermission() == 0) {
              window.webkitNotifications.createNotification(
                "", //icon
                formatLastMsg(data[0]["room"]["last_msg"]),
                data[0].users.nick_name
              );
            }
          }
          console.log(24234234, data);
          store.dispatch("updateRoomList", data);
        }
      })
      .catch((e) => {
        console.log(24234234, e);
      });
  });
  //监听群聊房间动态消息
  window.apiSocket.on("groupRoom", (data) => {
    response(data).then((res) => {
      console.log("groupRoom", res);
      let data = res.data.list;
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          let last_msg = formatLastMsg(data[i]["room"]["last_msg"]);
          //app消息通知
          if (window.plus && store.getters.isPaused && data[i].is_alert) {
            plus.push.createMessage(last_msg, "LocalMSG", {
              cover: false,
              title: data[i].users.nick_name,
            });
          }
        }
      }
      console.log(data);
      store.dispatch("updateGroupRoomList", data);
    });
  });
  //初始化好友邀请消息状态
  getAddressBookBeg().then((res) => {
    console.log("通讯录地址" + res);
    if (!res) return;
    let newFriendAlertNumber = 0;
    res.forEach((item) => {
      if (item.status == 0) {
        newFriendAlertNumber++;
      }
    });
    store.commit("updateNewFriendAlertNumber", newFriendAlertNumber);
  });
}
