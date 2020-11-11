/*
 * @Author: hua
 * @Date: 2019-12-30 20:23:23
 * @description: 有权限socketio监听事件
 * @LastEditors: hua
 * @LastEditTime: 2020-11-11 20:48:28
 */
import store from "../store";
import router from "../router";
import { joinChatSend } from "@/socketIoApi/chat";
import { stopVideo, hangUp, init, agreeStartVideo, onOffer, onAnswer, onCandidate, stop, connect } from "@/utils/webRtc.js"
import { MessageBox, Message } from "element-ui";

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
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { addressBookBegCacheDel } from "@/socketioApi/addressBook";
import utils from '@/utils/utils'

function compare(property){ 
  return function(a,b){ 
    var value1 = a[property]; 
    var value2 = b[property]; 
    return !(value1 - value2); 
  } 
}
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
    console.log("input",data)
    //用户输入时逻辑处理
    response(data).then((res) => {
      let data = res.data;
      console.log(data)
      console.log(store.getters.currentRoomUuid,data.room_uuid,store.getters.currentRoomType)
      if (
        data.even === "focus" &&
        store.getters.currentRoomUuid === data.room_uuid &&
        data.users.id !== store.getters.userInfo.id &&
        data.type === store.getters.ALONE
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
  window.apiSocket.on("video", (data) => {
    // 回复根据标志分类todo
    response(data).then((res) => {
      let data = res.data;
      console.log("video回复", data);
      //如果是视频
      if (data["type"] == store.getters.CHAT_VIDEO) {
        let evt = JSON.parse(res.data.msg);
        if (data.user_id !== store.getters.userInfo.id) {
          if (evt.type === 'offer') {
            console.log("Received offer, set offer, sending answer....")
            onOffer(evt);
          } else if (evt.type === 'answer' && peerStarted) {
            console.log('Received answer, settinng answer SDP');
            onAnswer(evt);
          } else if (evt.type === 'candidate' && peerStarted) {
            console.log('Received ICE candidate...');
            onCandidate(evt);
          } else if (evt.type === 'user dissconnected' && peerStarted) {
            console.log("disconnected");
            stop();
          } else if (evt.type === 'start') {
            MessageBox.confirm(`${data.name}邀请进入聊天`, {
              confirmButtonText: "重新登陆",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              joinChatSend({
                name: data.name,
                room_uuid: data.room_uuid,
                type: data.room_type,
                save_action: store.getters.LOCAL
              }).then(res => {
                init();
                agreeStartVideo();
              })
            });
          } else if (evt.type === 'end') {
            stopVideo();
            hangUp();
          }
        }
        clearTimeout(window.sendTimeOut)
        clearTimeout(window.broadcastTimeOut)
        return;
      }
    })
  })
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
        if (store.getters.currentRoomSaveAction == store.getters.LOCAL && data['type'] !== store.getters.CHAT_VIDEO) {
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
  send("join", {
    type: store.getters.NOTIFY,
  });
  //更新在线状态
  if (!window.loginConnectInterval) {
    window.loginConnectInterval = setInterval(() => {
      send("loginConnect", {}, "loginConnect");
      console.log("loginConnect")
    }, store.state.codeData.TIME.TIME_ONLINE_INTERVAL.value); //超时时间动态设置
  }
  //如果当前存在房间则进入
  if (store.getters.currentRoomUuid) {
    joinChatSend({
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
        // Toast({ mes: `${data.data.nick_name}申请加你好友` });
        Message({
          message:`${data.data.nick_name}申请加你好友`,
          type: "success",
          duration: 5 * 1000,
        });
        //app消息通知
        if (window.plus && store.getters.isPaused) {
          plus.push.createMessage(
            `${data.data.nick_name}申请加你好友`,
            "LocalMSG",
            { cover: false, title: data.data.nick_name }
          );
        }else{
          utils.others.showMsgNotification(data.data.nick_name, `${data.data.nick_name}申请加你好友`,()=>{});
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
        // Toast({ mes: "发送成功，对方已收到申请" });
        Message({
          message: "发送成功，对方已收到申请",
          type: "success",
          duration: 5 * 1000,
        });
      }
      if (data["action"] == "beg_add_success") {
        // Toast({ mes: `${data["nick_name"]}已同意添加好友` });
        Message({
          message: `${data["nick_name"]}已同意添加好友`,
          type: "success",
          duration: 5 * 1000,
        });
        updateAddressBookBeg(data["focused_user_id"], 1);
        router.push({
          name: "home",
        });
      }
      if (data["action"] == "invite") {
        console.log("延时推送任务咨询是否需要联系作者");
        MessageBox.confirm("是否有问题需要反馈?点确认自动咨询作者！", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          if (window.plus) {
            plus.runtime.openURL(
              "http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes"
            );
          } else {
            window.open(
              "http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes"
            );
          }
        });
      }
    });
  });
  //监听单聊房间动态消息
  window.apiSocket.on("room", (data) => {
    console.log(24234235, data);
    response(data)
      .then((res) => {
        console.log(24234235, res);
        let data = res.data.list;
        if (data) {
          //app消息通知
          console.log("app消息通知", store.getters.isPaused, data[0].is_alert)
          if (window.plus && store.getters.isPaused && data[0].is_alert && data[0].unread_number>0) {
            plus.push.createMessage(
              formatLastMsg(data[0]["room"]["last_msg"]),
              "LocalMSG",
              { cover: false, title: data[0].users.nick_name }
            );
          }
          //H5消息通知
          if (!window.plus && data[0].is_alert &&JSON.parse(data[0]["room"]["last_msg"])['user_id']!== store.getters.userInfo.id) {
            /* if (window.webkitNotifications.checkPermission() == 0) {
              window.webkitNotifications.createNotification(
                "", //icon
                formatLastMsg(data[0]["room"]["last_msg"]),
                data[0].users.nick_name
              );
            } */
            console.log("H5消息通知")
            utils.others.showMsgNotification(data[0].users.nick_name, formatLastMsg(data[0]["room"]["last_msg"]),()=>{});
          }
          userRoomRelationGet().then(resRoomRelation => {
            if (resRoomRelation.data.list != null) {
              data = data.concat(resRoomRelation.data.list);
              data.sort(compare('updated_at'))
              //this.updateGroupRoomList(resRoomRelation.data.list);
            }
            store.dispatch("updateRoomList", data);
          });
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
      if (data) {
        //for (let i = 0; i < data.length; i++) {
        let last_msg = formatLastMsg(data[0]["room"]["last_msg"]);
        //app消息通知
        if (window.plus && store.getters.isPaused && data[0].is_alert) {
          plus.push.createMessage(last_msg, "LocalMSG", {
            cover: false,
            title: data[0].users.nick_name,
          });
        }
        //H5消息通知
        if (!window.plus && data[0].is_alert && data[0].unread_number>0 &&JSON.parse(data[0]["room"]["last_msg"])['user_id']!== store.getters.userInfo.id) {
          utils.others.showMsgNotification(data[0].users.nick_name, last_msg,()=>{});
        }
        //}
        roomGet().then(res => {
          console.log("222222",res)
          let localRoomList = [];
          if (res.data.list != null) {
            localRoomList = res.data.list;
            console.log(res.data.list)
          }
          localRoomList = localRoomList.concat(data);
          localRoomList.sort(compare('updated_at'));  
          store.dispatch("updateGroupRoomList", data);
        });
      }
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
