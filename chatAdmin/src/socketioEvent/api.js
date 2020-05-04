/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:35
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-21 17:37:07
 */
import store from "../store";
import router from "../router";
import { MessageBox, Message } from "element-ui";
import { rsaEncode } from "@/utils/socketio";
export default function api(data, method) {
  var res = new Promise((resolve, reject) => {
    let encryptStr = "";
    if (data.c !== "UploadService") {
      encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY);
    } else {
      encryptStr = data;
    }
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
            message: res.msg,
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
        Message({
          message: res.msg,
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
