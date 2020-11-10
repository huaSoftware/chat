/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: socketio工具类
 * @LastEditors: hua
 * @LastEditTime: 2020-10-31 13:36:26
 */

import store from '../store'
import router from '../router'
import utils from '@/utils/utils'
import setupUnAuthEvent from '@/socketioEvent/unAuth'
import setupAuthEvent from '@/socketioEvent/auth'
import room from '@/socketioEvent/room'
import broadcast from '@/socketioEvent/broadcast'
import { Message } from 'element-ui'
import api from '../socketioEvent/api'
import loginEvent from '../socketioEvent/login'
import {ipcRenderer} from 'electron';
/* 注册socketio */
export function setup() {
	// 创建添加新好友套接字连接
	if (window.apiSocket == undefined) {
		//房间尝试重连次数
		window.tryRoomLinkCount = 0
		//广播尝试连接次数
		window.tryBroadcastLinkCount = 0
		// 创建聊天室套接字监听
		window.apiSocket = io.connect(process.env.VUE_APP_CLIENT_SOCKET + '/api');
	}
	setupListen()
}
/* 注册监听 */
export function setupListen(){
	if(window.apiSocket !== undefined){
		//删除所有监听
		handleRemoveAllListeners()
		//无令牌监听
		setupUnAuthEvent()
		//有令牌则监听
		if(store.getters.token){
			setupAuthEvent()
		}
	}
}

/* 注销socketio */
export function setDown(){
	clearTimeout(window.timeOut)
	if(typeof window.apiSocket == 'undefined'){
		window.apiSocket = io.connect(process.env.VUE_APP_CLIENT_SOCKET + '/api');
	}
	window.apiSocket.io.disconnect();    //先主动关闭连接
	//删除所有监听
	handleRemoveAllListeners()
	window.apiSocket = undefined
}

/* 注销监听 */
export function handleRemoveAllListeners(){
	//删除所有监听
	for(var listener in window.apiSocket.$events){
		if(listener != undefined){
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
export function  send(method, data, type = 'room') {
	if(typeof window.apiSocket !== 'undefined'){
		let token = store.getters.token
		if(token){
			data['Authorization'] = 'JWT '+token
		}
		if (type == 'room') {
			return room(data, method);
		}
		if (type == 'broadcast') {
			return broadcast(data, method);
		}
		if(type == 'api'){
			return api(data, method);
		}
		if(type == 'loginConnect' || type == 'logoutDisconnect'){
			return loginEvent(data, method);
		}
	}
}

/* 解析返回消息 */
export function response(res){
	var res = new Promise((resolve, reject)=>{
		if(!res){
			clearTimeout(window.sendTimeOut)
			clearTimeout(window.broadcastTimeOut)
			// Loading.close()
			return;
		}
		/**
		* error为true时 显示msg提示信息
		*/
		if (res.error_code === store.getters.CODE.SUCCESS.value) {
			clearTimeout(window.sendTimeOut)
			clearTimeout(window.broadcastTimeOut)
			resolve(res)
		}
		if (res.error_code === store.getters.CODE.BAD_REQUEST.value || res.error_code === store.getters.CODE.ERROR.value) {
			if(res.show == true){
				//Toast({mes:res.msg,icon: 'error'})
				Message({
					message: res.msg || "Error",
					type: "error",
					duration: 5 * 1000,
				});
			}
			// Loading.close()
			reject(res)
		}
		if (res.error_code === store.getters.CODE.ERROR_AUTH_CHECK_TOKEN_FAIL.value) {
			window.tryBroadcastLinkCount = 0
			clearTimeout(window.sendTimeOut)
			clearTimeout(window.broadcastTimeOut)
			// Loading.close()
			// Toast({mes: res.msg,icon: 'error'})
			Message({
				message: res.msg || "Error",
				type: "error",
				duration: 5 * 1000,
			});
			// 这里需要删除token，不然携带错误token无法去登陆
			window.localStorage.removeItem('token')
			store.commit('user/SET_TOKEN', null)
			//页面再次可见的时间-隐藏时间>10S,重连
            setDown();
            console.log("主动关闭连接后重连");
            setTimeout(() => {
              setup(); //打开连接，使用的vuejs，这是socketio的连接方法
			}, 1500); //1.5S后重连
			setTimeout(()=>{
				ipcRenderer.send('mianWindowLogout', 'ping') //给主进程发送消息“ping”
				router.push({name: 'authLogin'})
			},300)
			reject(res)
		}
		if (res.error_code === store.getters.CODE.ROOM_NO_EXIST.value) {
			if(res.show == true){
				// Toast({mes:res.msg,icon: 'error'})
				Message({
					message: res.msg || "Error",
					type: "error",
					duration: 5 * 1000,
				});
			}
			// Loading.close()
			reject(res)
		}
		reject(res)
	})
	return res
}

/**
 *  rsa加密
 *  @param object data
 *  @param string publicKey
 *  @return string 
 */
export function rsaEncode(data, publicKey){
	//rsa加密
	let encrypt = new JSEncrypt();
	encrypt.setPublicKey(publicKey);
	let str = JSON.stringify(data)
	let encryptStr = ""
	for(let i=0; i<str.length;i+=20){
		encryptStr = encryptStr + encrypt.encrypt(str.substring(i,i+20))+",";
	}
	encryptStr = encryptStr.substring(0,encryptStr.length-1);
	return encryptStr
}

/**
 * 修改发送信息状态
 * @param  object data
 * @param  int status
 * return index
 */
export function modifyMsgStatus(data, status){
	console.log(data)
	let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
	let uuid = data['room_uuid']+data['user_id']+data['created_at']
	let index = utils.arr.getIndexByUuid(uuid, msgList)
	console.log(index)
	if(typeof index == 'undefined'){
		return undefined
	}
	msgList[index]['send_status'] = status
	msgList[index]['msg'] = data['msg']
	msgList[index]['type'] = data['type']
	store.dispatch('updateMsgList', msgList)
	return index
}

/**
 * 修改读取信息状态
 * @param  object data
 * @param  int status
 * return index
 */
export function modifyMsgReadStatus(){
	let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
	msgList.forEach((item, index)=>{
		item['read_status'] = 1
	})
	store.dispatch('updateMsgList', msgList)
}

export function formatLastMsg(last_msg){
	try{
		let data = JSON.parse(last_msg)
		if(data['type'] == store.getters.IMG ){
			return '[图片]'
		}
		if(data['type'] == store.getters.FILE ){
			return '[文件]'
		}
		if(data['type'] == store.getters.RECORD ){
			return '[语音]'
		}
		if(data['type'] == store.getters.TEXT ){
			return data['msg']
		}
		if(data['type'] == store.getters.CHAT_NOTIFY ){
			return JSON.parse(data['msg'])
		}
		return data['msg']
	}catch(e){
		return last_msg
	}
}