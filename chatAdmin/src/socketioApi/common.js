/*
 * @Author: hua
 * @Date: 2020-04-19 13:19:03
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-19 13:19:13
 */
import { send } from "@/utils/socketio";

//上传图片
export function uploadBase64(data) {
  let reqData = {
    c: "UploadService",
    a: "uploadBase64",
    data: data
  };
  return send("send", reqData, "api");
}

//上传文件
export function uploadFile(data) {
  let reqData = {
    c: "UploadService",
    a: "upload",
    data: data
  };
  return send("send", reqData, "api");
}
