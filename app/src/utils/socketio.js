/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 
 * @LastEditors  : hua
 * @LastEditTime : 2019-12-24 11:21:26
 */

import store from '../store'
import router from '../router'
import utils from '@/utils/utils'
import { Confirm, Loading, Toast,Alert } from 'vue-ydui/dist/lib.rem/dialog'
import { addLocalRoomMsg, addAddressBookBeg, updateLocalRoomMsg, getAddressBookBeg,updateAddressBookBeg } from "@/utils/indexedDB"
import { updateCloudRoomMsg} from "@/socketioApi/room"
import {addressBookBegCacheDel} from '@/socketioApi/addressBook'

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
		window.apiSocket.on('connect', (data) => {
			//逻辑处理
			console.log("连接成功")
			//Alert.close()
		});
		window.apiSocket.on('connecting', (data) => {
			//逻辑处理
			console.log("断开正在连接了")
		});
		window.apiSocket.on('disconnect', (data) => {
			//逻辑处理
			console.log("断开连接")
		});
		window.apiSocket.on('connect_failed', (data) => {
			//逻辑处理
			console.log("连接失败")
		});
		window.apiSocket.on('error', (data) => {
			//逻辑处理
			console.log("错误发生，并且无法被其他事件类型所处理")
			Alert({
				'mes':'链接已经断开',
				callback: () => {
					window.location.reload()
				}
			})
		});
		window.apiSocket.on('reconnect', (data) => {
			//逻辑处理
			console.log("成功重连")
		});
		window.apiSocket.on('reconnecting', (data) => {
			//逻辑处理
			console.log("正在重连")
		});
		window.apiSocket.on('connect_error', function(data){
			console.log(data + ' - connect_error');
		});
		//有令牌则监听
		if(store.getters.token){

			window.apiSocket.on('join', (data) => {
				//逻辑处理
			});
			window.apiSocket.on('leave', (data) => {
				//逻辑处理
			});
			window.apiSocket.on('send', (data) => {
				//逻辑处理
			});
			///监听回复的消息
			window.apiSocket.on('chat', (data) => {
				// 回复根据标志分类todo
				response(data).then(res=>{
					let data = res.data
					//逻辑处理,存放indexdDB,存放一份实时的在vuex
					console.log("发送消息监听回复",data)
					let index = modifyMsgStatus(data, store.getters.SUCCESS)
					let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
					//这边会有发送后接收不到的问题
					if(typeof index !== 'undefined'){
						msgList[index]['send_status'] = store.getters.SUCCESS
						//他人发送的需要根据设置的房间状态去同步聊天数据
						delete msgList[index]['id']
						console.log("消息列表",msgList[index])
						if(store.getters.currentRoomSaveAction == store.getters.LOCAL){
							console.log(msgList[index])
							addLocalRoomMsg(msgList[index])
						}/* else if(store.getters.currentRoomSaveAction == store.getters.CLOUD){
							addCloudRoomMsg(msgList[index])
						} */
					}else{
						//app消息推送，废弃，直接监听外部消息
						/* if(window.plus && store.getters.isPaused){
							plus.push.createMessage(data['msg'], "LocalMSG", {cover:false,title:data['name']});
						} */
						msgList = msgList.concat(data)
					}
					store.dispatch('updateMsgList', msgList)
					let reqData = {
						room_uuid :data['room_uuid'],
						created_at :data['created_at'],
						user_id:data['user_id'],
						send_status: store.getters.SUCCESS
					}
					if(store.getters.currentRoomSaveAction == store.getters.LOCAL){
						updateLocalRoomMsg(reqData)
					}else if(store.getters.currentRoomSaveAction == store.getters.CLOUD){
						updateCloudRoomMsg(reqData)
					}
		
				})
			});
			//监听
			send('join', {}, 'broadcast')
			//更新在线状态
			if(!window.loginConnectInterval){
				window.loginConnectInterval = setInterval(()=>{
					send('loginConnect',{},'loginConnect')
				},5000)
			}
			//如果当前存在房间则进入
			if(store.getters.currentRoomUuid !== ''&& store.getters.currentRoomName !== ''){
				send('join', {
					name: store.getters.currentRoomName,
					room_uuid: store.getters.currentRoomUuid,
					type: store.getters.currentRoomType,
					save_action: store.getters.currentRoomSaveAction
				})
			}
			//监听好友请求
			window.apiSocket.on('beg', (data) => {
				response(data).then(res=>{
					let data = res.data
					if (data['action'] == 'beg_add') {
						// 复制原来的值
						data['data']['user_id'] = data['data']['id'];
						// 删除原来的键
						delete data['data']['id'];
						// 增加状态,0申请，1通过，2拒绝
						data['data']['status'] = store.getters.APPLY
						Toast({ mes: `${data.data.nick_name}申请加你好友` });
						//app消息通知
						if(window.plus && store.getters.isPaused){
							plus.push.createMessage(`${data.data.nick_name}申请加你好友`, "LocalMSG", {cover:false,title:data.data.nick_name});
						} 
						console.log(data)
						//接收到后删除缓存
						addressBookBegCacheDel()
						addAddressBookBeg(data['data'])
						getAddressBookBeg().then(res=>{
							console.log(res)
							let newFriendAlertNumber = 0
							res.forEach((item)=>{
								if(item.status==0){
									newFriendAlertNumber++
								}
							})
							store.commit('updateNewFriendAlertNumber', newFriendAlertNumber)
						})
					}
					if (data['action'] == 'beg_success') {
						Toast({ mes: '发送成功，对方已收到申请' });
					}
					if(data['action'] == 'beg_add_success' ){
						Toast({ mes: '对方已同意添加好友' });
						updateAddressBookBeg(data['focused_user_id'], 1)
					}
					if(data['action'] == 'invite'){
						console.log('延时推送任务咨询是否需要联系作者')
						Confirm({
							title: '提示',
							mes: '是否有问题需要反馈?点确认自动咨询作者！',
							opts: [
							{
								txt: '取消',
								color: false,
								callback: () => {
								}
							},
							{
								txt: '确定',
								color: true,
								callback: () => {
									if(window.plus){
										plus.runtime.openURL('http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes')
									}else{
										window.open('http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes')
									}
								}
							}
							]
						});
					}
				})
			});
			//监听单聊房间动态消息
			window.apiSocket.on('room', (data) => {
				response(data).then(res=>{
					let data = res.data.list
					if(data != null){
						console.log(1111,res)
						//app消息通知
						if(window.plus && store.getters.isPaused && data[0].is_alert){
							plus.push.createMessage(formatLastMsg(data[0]['room']['last_msg']), "LocalMSG", {cover:false,title:data[0].users.nick_name});
						} 
						store.dispatch('updateRoomList', data)
					}
				})
			});
			//监听群聊房间动态消息
			window.apiSocket.on('groupRoom', (data) => {
				response(data).then(res=>{
					let data = res.data.list
					if(data != null){
						//app消息通知
						if(window.plus && store.getters.isPaused && data[0].is_alert){
							plus.push.createMessage(formatLastMsg(data[0]['room']['last_msg']), "LocalMSG", {cover:false,title:data[0].users.nick_name});
						} 
						console.log(data)
						store.dispatch('updateGroupRoomList', data)
					}
				})
			});
			//初始化好友邀请消息状态
			getAddressBookBeg().then(res=>{
				console.log("通讯录地址"+res)
				if(!res)return
				let newFriendAlertNumber = 0
				res.forEach((item)=>{
					if(item.status==0){
						newFriendAlertNumber++
					}
				})
				store.commit('updateNewFriendAlertNumber', newFriendAlertNumber)
			})
		}
	}
}

/* 注销socketio */
export function setDown(){
	if(typeof window.apiSocket == 'undefined'){
		window.apiSocket = io.connect(process.env.VUE_APP_CLIENT_API + '/api');
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
			//响应超时
			window.sendTimeOut = setTimeout(()=>{
				if(method == 'join'){
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
						Alert({'mes':'房间连接已断开',
							callback: () => {
								window.location.reload()
						}})
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
						Alert({'mes':'房间连接已断开', callback: () => {
							window.location.reload()
						}})
					}
				}
				if(method == 'chat'){
					Toast({
						mes: '响应超时',
						timeout: 1500,
						icon: 'error'
					});
					modifyMsgStatus(data.data, store.getters.FAIL)
				}
			},5500)
			let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
			window.apiSocket.emit(method, encryptStr, (recv)=>{
				console.log("发送消息后emit回复"+recv)
				//未加入房间的时候对方收不到消息
				response(recv).then(res=>{
					if(res.data.action == 'chat'){
						clearTimeout(window.sendTimeOut)
						modifyMsgStatus(data.data, store.getters.SUCCESS)
					}
					if(res.data.action == 'leave'){
						clearTimeout(window.sendTimeOut)
						Loading.close()
						//如果不在room路由下
						if(router.history.current.fullPath.indexOf('room') == -1){
							store.commit('updateCurrentRoomUuid', '')
							store.commit('updateCurrentRoomName', '')
							store.commit('updateCurrentRoomType', store.getters.ALONE)
							store.commit('updateCurrentRoomSaveAction', store.getters.LOCAL)
						}
					}
					if(res.data.action == 'join'){
						clearTimeout(window.sendTimeOut)
						Loading.close()
						let queryData = {}
						store.commit('updateCurrentRoomUuid', data.room_uuid)
						store.commit('updateCurrentRoomName', data.name)
						store.commit('updateCurrentRoomType', data.type)
						store.commit('updateCurrentRoomSaveAction', data.save_action)
						if(data.name){
							queryData.name = data.name
						}
						router.push({
							name: 'room',
							query: queryData
						}).catch(()=>{})
					}
					Promise.resolve(recv)
				}).catch(e=>{
					//服务器出错
					clearTimeout(window.sendTimeOut)
					Toast({
						mes: e.traceback.toString(),
						timeout: 1500,
						icon: 'error'
					});
					modifyMsgStatus(data.data, store.getters.FAIL)
					Promise.reject(e)
				})
			})
		}
		if (type == 'broadcast') {
			if(!store.getters.token){
				window.tryBroadcastLinkCount = 0
				clearTimeout(window.broadcastTimeOut)
				Loading.close()
			}
			//响应超时
			window.broadcastTimeOut = setTimeout(()=>{
				if(method == 'join'){
					Loading.open(`广播尝试第${window.tryBroadcastLinkCount+1}次链接中...`)
					if(window.tryBroadcastLinkCount<3){
						send('join', {}, 'broadcast')
						window.tryBroadcastLinkCount++
					}else{
						window.tryBroadcastLinkCount = 0
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Alert({'mes':'广播连接已断开',
						callback: () => {
							window.location.reload()
						}})
					}
				}
				if(method == 'leave'){
					Loading.open(`广播退出超时,尝试第${window.tryBroadcastLinkCount+1}次退出中...`)
					if(window.tryBroadcastLinkCount<3){
						send('leave', {}, 'broadcast')
						window.tryBroadcastLinkCount++
					}else{
						window.tryBroadcastLinkCount = 0
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Alert({'mes':'广播连接已断开',
						callback: () => {
							window.location.reload()
						}})
					}
				}
			},5500)
			data['type'] = store.getters.NOTIFY
			let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
			console.log("广播："+method, "秘钥："+encryptStr)
			window.apiSocket.emit(method, encryptStr, (recv)=>{
				response(recv).then(res=>{
					if(res.data.action == 'leave'){	
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
					}
					if(res.data.action == 'join'){
						clearTimeout(window.broadcastTimeOut)	
						Loading.close()			
					}
				}).catch(e=>{
					//服务器出错
				})
			})
		}
		if(type == 'api'){
			var res = new Promise((resolve, reject)=>{
				let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
				//设置超时时间5s
				let timeOut = setTimeout(()=>{
					Alert({
						'mes':'接口已断开链接，请重启',
						callback: () => {
							window.location.reload()
						}
					})
				},5000)
				window.apiSocket.emit(method, encryptStr, (res)=>{
					clearTimeout(timeOut)
					console.log(res)
					if (res.error_code === 200) {
						resolve(res)
					}
					if (res.error_code === 400 || res.error_code === 500) {
						if(res.show == true){
							Toast({mes:res.msg,icon: 'error'})
						}
						Loading.close()
						reject('error')
					}
					if (res.error_code === 401 || res.error_code === 10001) {
						clearTimeout(window.sendTimeOut)
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Toast({mes: res.msg,icon: 'error'})
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
		if(type == 'loginConnect' || type == 'logoutDisconnect'){
			var res = new Promise((resolve, reject)=>{
				let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
				//设置超时时间5s
				let timeOut = setTimeout(()=>{
					Alert({
						'mes':'在线检测已断开链接，请重启',
						callback: () => {
							window.location.reload()
						}
					})
				},5000)
				window.apiSocket.emit(method, encryptStr, (res)=>{
					clearTimeout(timeOut)
					console.log(res)
					if (res.error_code === 200) {
						resolve(res)
					}
					if (res.error_code === 400 || res.error_code === 500) {
						if(res.show == true){
							Toast({mes:res.msg,icon: 'error'})
						}
						Loading.close()
						reject('error')
					}
					if (res.error_code === 401 || res.error_code === 10001) {
						clearTimeout(window.sendTimeOut)
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Toast({mes: res.msg,icon: 'error'})
						// 这里需要删除token，不然携带错误token无法去登陆
						window.localStorage.removeItem('token')
						store.commit('SET_TOKEN', null)
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

/* 解析返回消息 */
export function response(res){
	var res = new Promise((resolve, reject)=>{
		/**
		* error为true时 显示msg提示信息
		*/
		if (res.error_code === 200) {
			resolve(res)
		}
		if (res.error_code === 400 || res.error_code === 500) {
			if(res.show == true){
				Toast({mes:res.msg,icon: 'error'})
			}
			Loading.close()
			reject(res)
		}
		if (res.error_code === 401|| res.error_code === 10001) {
			clearTimeout(window.sendTimeOut)
			clearTimeout(window.broadcastTimeOut)
			Loading.close()
			Toast({mes: res.msg,icon: 'error'})
			// 这里需要删除token，不然携带错误token无法去登陆
			window.localStorage.removeItem('token')
			store.commit('SET_TOKEN', null)
			router.push({name: 'authLogin'})
			reject(res)
		}
		if (res.error_code === 20000) {
			if(res.show == true){
				Toast({mes:res.msg,icon: 'error'})
			}
			Loading.close()
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
	for(let i=0; i<str.length;i+=100){
		encryptStr = encryptStr + encrypt.encrypt(str.substring(i,i+100))+",";
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
	store.dispatch('updateMsgList', msgList)
	return index
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
		return data['msg']
	}catch(e){
		console.log(e)
		return last_msg
	}
}