/*
 * @Author: hua
 * @Date: 2019-11-19 15:01:33
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-19 16:49:53
 */
import { send } from "@/utils/socketio";

// 向已生成的房间发送消息
export function chatSend(data) {
  let reqData = {
    c: "ChatService",
    a: "adminChat",
    data: data
  };
  return send("send", reqData, "api");
}

// 创建管理员房间
export function adminCreateRoom(data) {
  let reqData = {
    c: "ChatService",
    a: "adminCreateRoom",
    data: data
  };
  return send("send", reqData, "api");
}

/**
 * 加入聊天室
 * @param {*} data
 */
export function joinChatSend(data) {
  return send("adminJoin", data, "api");
}
