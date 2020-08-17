/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:57
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-08-17 21:14:00
 */
import store from "../store";
import router from "../router";
import { rsaEncode } from "@/utils/socketio";
import { MessageBox, Message } from "element-ui";
export default function login(data, method) {
  var res = new Promise((resolve, reject) => {
    let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY);
    window.apiSocket.emit(method, encryptStr, res => {
      console.log(res);
      if (res.error_code === store.getters.CODE.SUCCESS.value) {
        resolve(res);
      }
      if (
        res.error_code === store.getters.CODE.BAD_REQUEST.value ||
        res.error_code === store.getters.CODE.ERROR.value
      ) {
        if (res.show == true) {
          Message({
            message: res.msg || "Error",
            type: "error",
            duration: 5 * 1000
          });
        }

        reject("error");
      }
      if (
        res.error_code === store.getters.CODE.ERROR_AUTH_CHECK_TOKEN_FAIL.value
      ) {
        clearTimeout(window.sendTimeOut);
        clearTimeout(window.broadcastTimeOut);
        /* clearInterval(window.loginConnectInterval); */
        Message({
          message: res.msg || "Error",
          type: "error",
          duration: 5 * 1000
        });
        // 这里需要删除token，不然携带错误token无法去登陆
        window.localStorage.removeItem("token");
        store.dispatch("user/resetToken");
        router.push({ name: "login" });
        reject("error");
      }
      reject("error");
    });
  });
  return res;
}
