/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-08-17 21:13:20
 */

import store from "../store";
import router from "../router";
import setupUnAuthEvent from "@/socketioEvent/unAuth";
import setupAuthEvent from "@/socketioEvent/auth";
import { MessageBox, Message } from "element-ui";
import broadcast from '@/socketioEvent/broadcast'
import login from '../socketioEvent/login'
import room from '@/socketioEvent/room'
import utils from "@/utils/utils";
/* 注册socketio */
export function setup() {
  // 创建添加新好友套接字连接
  if (window.apiSocket == undefined) {
    //房间尝试重连次数
    window.tryRoomLinkCount = 0;
    //广播尝试连接次数
    window.tryBroadcastLinkCount = 0;
    // 创建聊天室套接字监听
    window.apiSocket = io.connect(process.env.VUE_APP_CLIENT_SOCKET + "/api");
  }
  setupListen();
}
/* 注册监听 */
export function setupListen() {
  if (window.apiSocket !== undefined) {
    //删除所有监听
    handleRemoveAllListeners();
    //无令牌监听
    setupUnAuthEvent();
    //有令牌则监听
    if (store.getters.token) {
      setupAuthEvent();
    }
  }
}

/* 注销socketio */
export function setDown() {
  clearTimeout(window.timeOut);
  if (typeof window.apiSocket == "undefined") {
    window.apiSocket = io.connect(process.env.VUE_APP_CLIENT_SOCKET + "/api");
  }
  window.apiSocket.io.disconnect(); //先主动关闭连接
  //删除所有监听
  handleRemoveAllListeners();
  window.apiSocket = undefined;
}

/* 注销监听 */
export function handleRemoveAllListeners() {
  //删除所有监听
  for (var listener in window.apiSocket.$events) {
    if (listener != undefined) {
      window.apiSocket.removeAllListeners(listener);
    }
  }
}
/**
 * 发送消息
 * @param string data
 * @param object data
 * @return void
 */
export function send(method, data, type = "room") {
  if (typeof window.apiSocket !== "undefined") {
    let token = store.getters.token;
    if (token) {
      data["Authorization"] = "JWT " + token;
    }
    if (type == 'room') {
			room(data, method);
		}
		if (type == 'broadcast') {
			broadcast(data, method);
    }
    /* if(type == 'loginConnect' || type == 'logoutDisconnect'){
			return login(data, method);
		} */
    if (type == "api") {
      var res = new Promise((resolve, reject) => {
        let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY);
        //设置超时时间5s
        let timeOut = setTimeout(() => {
          MessageBox.confirm("接口已断开链接，请重启", {
            confirmButtonText: "重启",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            location.reload();
          });
        }, 5000);
        window.apiSocket.emit(method, encryptStr, res => {
          console.log(2);
          clearTimeout(timeOut);
          console.log(res);
          if (res.error_code === 200) {
            resolve(res);
          }
          if (res.error_code === 400 || res.error_code === 500) {
            if (res.show == true) {
              Message({
                message: res.msg || "Error",
                type: "error",
                duration: 5 * 1000
              });
            }
            reject("error");
          }
          if (res.error_code === 401 || res.error_code === 10001) {
            clearTimeout(window.sendTimeOut);
            clearTimeout(window.broadcastTimeOut);
            Message({
              message: res.msg || "Error",
              type: "error",
              duration: 5 * 1000
            });
            // 这里需要删除token，不然携带错误token无法去登陆
            window.localStorage.removeItem("token");
            store.dispatch("user/resetToken");
            //setDown()
            router.push({ name: "login" });
            reject("error");
          }
          reject("error");
        });
      });
      return res;
    }
  }
}

/**
 *  rsa加密
 *  @param object data
 *  @param string publicKey
 *  @return string
 */
export function rsaEncode(data, publicKey) {
  //rsa加密
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  let str = JSON.stringify(data);
  let encryptStr = "";
  for (let i = 0; i < str.length; i += 100) {
    encryptStr = encryptStr + encrypt.encrypt(str.substring(i, i + 100)) + ",";
  }
  encryptStr = encryptStr.substring(0, encryptStr.length - 1);
  return encryptStr;
}

/* 解析返回消息 */
export function response(res) {
  var res = new Promise((resolve, reject) => {
    /**
     * error为true时 显示msg提示信息
     */
    if (res.error_code === store.getters.CODE.SUCCESS.value) {
      resolve(res);
    }
    if (
      res.error_code === store.getters.CODE.BAD_REQUEST.value ||
      res.error_code === store.getters.CODE.ERROR.value
    ) {
      if (res.show == true) {
        Toast({ mes: res.msg, icon: "error" });
      }
      Loading.close();
      reject(res);
    }
    if (
      res.error_code === store.getters.CODE.ERROR_AUTH_CHECK_TOKEN_FAIL.value
    ) {
      clearTimeout(window.sendTimeOut);
      clearTimeout(window.broadcastTimeOut);
      Loading.close();
      Toast({ mes: res.msg, icon: "error" });
      // 这里需要删除token，不然携带错误token无法去登陆
      window.localStorage.removeItem("token");
      store.dispatch("user/resetToken");
      router.push({ name: "login" });
      reject(res);
    }
    if (res.error_code === store.getters.CODE.ROOM_NO_EXIST.value) {
      if (res.show == true) {
        Toast({ mes: res.msg, icon: "error" });
      }
      Loading.close();
      reject(res);
    }
    reject(res);
  });
  return res;
}

/**
 * 修改发送信息状态
 * @param  object data
 * @param  int status
 * return index
 */
export function modifyMsgStatus(data, status) {
  console.log(data);
  let msgList = JSON.parse(JSON.stringify(store.getters.msgList));
  let uuid = data["room_uuid"] + data["user_id"] + data["created_at"];
  let index = utils.arr.getIndexByUuid(uuid, msgList);
  console.log(index);
  if (typeof index == "undefined") {
    return undefined;
  }
  msgList[index]["send_status"] = status;
  store.dispatch("updateMsgList", msgList);
  return index;
}

/**
 * 修改读取信息状态
 * @param  object data
 * @param  int status
 * return index
 */
export function modifyMsgReadStatus() {
  let msgList = JSON.parse(JSON.stringify(store.getters.msgList));
  msgList.forEach((item, index) => {
    item["read_status"] = 1;
  });
  store.dispatch("updateMsgList", msgList);
}

export function formatLastMsg(last_msg) {
  try {
    let data = JSON.parse(last_msg);
    if (data["type"] == store.getters.IMG) {
      return "[图片]";
    }
    if (data["type"] == store.getters.FILE) {
      return "[文件]";
    }
    if (data["type"] == store.getters.RECORD) {
      return "[语音]";
    }
    if (data["type"] == store.getters.TEXT) {
      return data["msg"];
    }
    if (data["type"] == store.getters.CHAT_NOTIFY) {
      return JSON.parse(data["msg"]);
    }
    return data["msg"];
  } catch (e) {
    return last_msg;
  }
}
