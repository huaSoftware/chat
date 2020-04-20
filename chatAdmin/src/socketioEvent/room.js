/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:03
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-20 19:59:54
 */
import store from "../store";
import router from "../router";
import { MessageBox, Message } from "element-ui";
import { send, rsaEncode, response, modifyMsgStatus } from "@/utils/socketio";
export default function room(data, method) {
  //响应超时
  window.sendTimeOut = setTimeout(() => {
    if (method == "chat") {
      Message({
        message: "响应超时" || "Error",
        type: "error",
        duration: 5 * 1000
      });
      modifyMsgStatus(data.data, store.getters.FAIL);
    }
  }, store.state.codeData.TIME.TIME_OUT.value);
  let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY);
  window.apiSocket.emit(method, encryptStr, recv => {
    console.log("发送消息后emit回复" + recv);
    //未加入房间的时候对方收不到消息
    response(recv)
      .then(res => {
        if (res.data.action == "chat") {
          clearTimeout(window.sendTimeOut);
          modifyMsgStatus(data.data, store.getters.SUCCESS);
        }
        if (res.data.action == "leave") {
          clearTimeout(window.sendTimeOut);
          //如果不在room路由下
          if (router.history.current.fullPath.indexOf("room") == -1) {
            store.commit("updateCurrentRoomUuid", "");
            store.commit("updateCurrentRoomName", "");
            store.commit("updateCurrentRoomType", store.getters.ALONE);
            store.commit("updateCurrentRoomSaveAction", store.getters.LOCAL);
          }
        }
        if (res.data.action == "join") {
          clearTimeout(window.sendTimeOut);
          let queryData = {};
          store.commit("updateCurrentRoomUuid", data.room_uuid);
          store.commit("updateCurrentRoomName", data.name);
          store.commit("updateCurrentRoomType", data.type);
          store.commit("updateCurrentRoomSaveAction", data.save_action);
          if (data.name) {
            queryData.name = data.name;
          }
          console.log("聊天室进入传参", data);
          if (data.type == store.getters.ALONE) {
            router
              .push({
                name: "room",
                query: queryData
              })
              .catch(() => {});
          }
          if (data.type == store.getters.GROUP) {
            router
              .push({
                name: "groupRoom",
                query: queryData
              })
              .catch(() => {});
          }
        }
        Promise.resolve(recv);
      })
      .catch(e => {
        //服务器出错
        clearTimeout(window.sendTimeOut);
        Message({
          message: e.toString() || "Error",
          type: "error",
          duration: 5 * 1000
        });
        modifyMsgStatus(data.data, store.getters.FAIL);
        Promise.reject(e);
      });
  });
}
