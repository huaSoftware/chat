/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-21 09:12:12
 */

import store from '../store'
import router from '../router'
import { MessageBox, Message } from 'element-ui'
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
	//有令牌则监听
	if(store.getters.token && window.apiSocket !== undefined){
		//删除所有监听
		for(var listener in window.apiSocket.$events){
			if(listener != undefined){
				window.apiSocket.removeAllListeners(listener);
			}
		}
	}
	window.apiSocket.on('join', (data) => {
		//逻辑处理
	});
	window.apiSocket.on('leave', (data) => {
		//逻辑处理
	});
	window.apiSocket.on('send', (data) => {
		//逻辑处理
	});
	window.apiSocket.on('connect', (data) => {
		//逻辑处理
	});
	window.apiSocket.on('disconnect', (data) => {
		//逻辑处理
	});
}

/* 注销socketio */
export function setDown(){
	if(typeof window.apiSocket == 'undefined'){
		window.apiSocket = io.connect(process.env.VUE_APP_CLIENT_API + '/api');
	}
	window.apiSocket.io.disconnect();    //先主动关闭连接
	//删除所有监听
	for(var listener in window.apiSocket.$events){
		if(listener != undefined){
			window.apiSocket.removeAllListeners(listener);
		}
	}
	window.apiSocket = undefined
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
		if(type == 'api'){
			var res = new Promise((resolve, reject)=>{
				let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
				//设置超时时间5s
				let timeOut = setTimeout(()=>{
                    MessageBox.confirm('接口已断开链接，请重启', {
                        confirmButtonText: '重启',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        location.reload()
                      })
				},5000)
				window.apiSocket.emit(method, encryptStr, (res)=>{
					console.log(2)
					clearTimeout(timeOut)
					console.log(res)
					if (res.error_code === 200) {
						resolve(res)
					}
					if (res.error_code === 400 || res.error_code === 500) {
						if(res.show == true){
                            Message({
                                message: res.msg || 'Error',
                                type: 'error',
                                duration: 5 * 1000
                            })
						}
						reject('error')
					}
					if (res.error_code === 401 || res.error_code === 10001) {
						clearTimeout(window.sendTimeOut)
						clearTimeout(window.broadcastTimeOut)
						Message({
                            message: res.msg || 'Error',
                            type: 'error',
                            duration: 5 * 1000
                        })
						// 这里需要删除token，不然携带错误token无法去登陆
						window.localStorage.removeItem('token')
						store.commit('SET_TOKEN', null)
						//setDown()
						router.push({name: 'authLogin'})
						reject('error')
					}
					reject('error')
				})
				
			})
			return res
		}
	}
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
	for(let i=0; i<str.length;i+=100){
		encryptStr = encryptStr + encrypt.encrypt(str.substring(i,i+100))+",";
	}
	encryptStr = encryptStr.substring(0,encryptStr.length-1);
	return encryptStr
}
