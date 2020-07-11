/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:03
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-07-02 21:58:24
 */
import store from "../store";
import router from "../router";
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { send, rsaEncode, response, modifyMsgStatus } from "@/utils/socketio";
export default function room(data, method) {
  //如果sendTimeout存在先要清空
  if(window.sendTimeOut){
    clearTimeout(window.sendTimeOut)
  }
  //响应超时
  window.sendTimeOut = setTimeout(() => {
    /* if(method == 'join'){
            Loading.open(`房间加入超时,尝试第${window.tryRoomLinkCount+1}次加入...`)
            if(window.tryRoomLinkCount<3){
                send('join', {
                    name: store.getters.currentRoomName,
                    room_uuid: store.getters.currentRoomUuid,
                    type: store.getters.currentRoomType
                })
                window.tryRoomLinkCount++
            }else{
                window.tryRoomLinkCount = 0
                clearTimeout(window.sendTimeOut)
                Loading.close()
                router.push({
                    name: 'connectLose',
                    query: {text:"房间连接已断开"}
                })
            }
        }
        if(method == 'leave'){
            Loading.open(`房间退出超时,尝试第${window.tryRoomLinkCount+1}次退出...`)
            if(window.tryRoomLinkCount<3){
                send('leave', {
                    room_uuid: store.getters.currentRoomUuid
                })
                window.tryRoomLinkCount++
            }else{
                window.tryRoomLinkCount = 0
                clearTimeout(window.sendTimeOut)
                Loading.close()
                router.push({
                    name: 'connectLose',
                    query: {text:"房间连接已断开"}
                })
            }
        } */
    if (method == "chat") {
      console.log("55555555555555555555")
      Toast({
        mes: "响应超时",
        timeout: 1500,
        icon: "error",
      });
      modifyMsgStatus(data.data, store.getters.FAIL);
    }
  }, store.state.codeData.TIME.TIME_OUT.value);
  if (method === "leave") {
    clearTimeout(window.sendTimeOut);
    Loading.close();
    //如果不在room路由下
    if (router.history.current.fullPath.indexOf("room") === -1) {
      store.commit("updateCurrentRoomUuid", "");
      store.commit("updateCurrentRoomName", "");
      store.commit("updateCurrentRoomType", store.getters.ALONE);
      store.commit("updateCurrentRoomSaveAction", store.getters.LOCAL);
    }
  }
  var res = new Promise((resolve, reject)=>{
    let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY);
    window.apiSocket.emit(method, encryptStr, (recv) => {
      console.log("发送消息后emit回复" + recv);
      if(!recv){
        console.log("33333333333333333333")
        clearTimeout(window.sendTimeOut)
        resolve(recv);
        return;
      }
      //未加入房间的时候对方收不到消息
      response(recv)
        .then((res) => {
          if (res.data.action === "chat") {
            clearTimeout(window.sendTimeOut);
            modifyMsgStatus(data.data, store.getters.SUCCESS);
          }
          if (res.data.action === "join") {
            clearTimeout(window.sendTimeOut);
            Loading.close();
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
                  query: queryData,
                })
                .catch(() => {});
            }
            if (data.type == store.getters.ADMIN) {
              router
                .push({
                  name: "room",
                  query: queryData,
                })
                .catch(() => {});
            }
            if (data.type == store.getters.GROUP) {
              router
                .push({
                  name: "groupRoom",
                  query: queryData,
                })
                .catch(() => {});
            }
            resolve(recv)
          }
          resolve(recv);
        })
        .catch((e) => {
          //服务器出错
          clearTimeout(window.sendTimeOut);
          Toast({
            mes: e.toString(),
            timeout: 1500,
            icon: "error",
          });
          modifyMsgStatus(data.data, store.getters.FAIL);
          reject(e);
        });
    });
  })
  return res
}
