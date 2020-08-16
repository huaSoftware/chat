/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:23
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-08-16 12:29:06
 */
import store from "../store";
import router from "../router";
import { send, rsaEncode, response } from "@/utils/socketio";
export default function broadcast(data, method) {
  if (!store.getters.token) {
    window.tryBroadcastLinkCount = 0;
    clearTimeout(window.broadcastTimeOut);
  }
  //响应超时
  window.broadcastTimeOut = setTimeout(() => {
    if (method == "adminJoin") {
      //Loading.open(`广播尝试第${window.tryBroadcastLinkCount + 1}次链接中...`);
      if (window.tryBroadcastLinkCount < 3) {
        send("adminJoin", {}, "broadcast");
        window.tryBroadcastLinkCount++;
      } else {
        window.tryBroadcastLinkCount = 0;
        clearTimeout(window.broadcastTimeOut);
        /* router.push({
          name: "connectLose",
          query: { text: "广播连接已断开" }
        }); */
      }
    }
    if (method == "leave") {
      /*  Loading.open(
        `广播退出超时,尝试第${window.tryBroadcastLinkCount + 1}次退出中...`
      ); */
      if (window.tryBroadcastLinkCount < 3) {
        send("leave", {}, "broadcast");
        window.tryBroadcastLinkCount++;
      } else {
        window.tryBroadcastLinkCount = 0;
        clearTimeout(window.broadcastTimeOut);
        // 这里需要删除token，不然携带错误token无法去登陆
        /* window.localStorage.removeItem("token");
        store.dispatch("user/resetToken");
        router.push({
          name: "login"
        }); */
      }
    }
  }, store.getters.TIME.TIME_OUT.value);
  data["type"] = store.getters.NOTIFY;
  let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY);
  console.log("广播：" + method, "秘钥：" + encryptStr);
  window.apiSocket.emit(method, encryptStr, recv => {
    response(recv)
      .then(res => {
        if (res.data.action == "adminLeave") {
          clearTimeout(window.broadcastTimeOut);
        }
        if (res.data.action == "adminJoin") {
          clearTimeout(window.broadcastTimeOut);
        }
        if (res.data.action == "input") {
          clearTimeout(window.broadcastTimeOut);
        }
      })
      .catch(e => {
        //服务器出错
      });
  });
}
