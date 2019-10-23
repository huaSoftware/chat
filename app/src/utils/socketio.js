
import store from '../store'
import router from '../router'
import utils from '@/utils/utils'
import { Loading, Toast,Alert } from 'vue-ydui/dist/lib.rem/dialog'
import { addLocalRoomMsg, addAddressBookBeg, updateLocalRoomMsg, getAddressBookBeg,updateAddressBookBeg } from "@/utils/indexedDB"
import {addCloudRoomMsg, updateCloudRoomMsg} from "@/socketioApi/room"
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
	//有令牌则监听
	if(store.getters.token && window.apiSocket !== undefined){
		///监听回复的消息
		window.apiSocket.on('chat', (data) => {
			// 回复根据标志分类todo
			response(data).then(res=>{
				let data = res.data
				//逻辑处理,存放indexdDB,存放一份实时的在vuex
				console.log("发送消息回复",data)
				let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
				let index = utils.arr.getIndexByTime(data['created_at'], msgList)
				//这边会有发送后接收不到的问题
				if(typeof index !== 'undefined'){
					msgList[index]['send_status'] = store.getters.SUCCESS
					//他人发送的需要根据设置的房间状态去同步聊天数据
					delete msgList[index]['id']
					console.log("消息列表",msgList[index])
					if(store.getters.currentRoomSaveAction == store.getters.LOCALSAVE){
						addLocalRoomMsg(msgList[index])
					}else if(store.getters.currentRoomSaveAction == store.getters.CLOUDSAVE){
						addCloudRoomMsg(msgList[index])
					}
				}else{
					msgList = msgList.concat(data)
				}
				store.dispatch('updateMsgList', msgList)
				let reqData = {
					room_uuid :data['room_uuid'],
					created_at :data['created_at'],
					send_status: store.getters.SUCCESS
				}
				if(store.getters.currentRoomSaveAction == store.getters.LOCALSAVE){
					updateLocalRoomMsg(reqData)
				}else if(store.getters.currentRoomSaveAction == store.getters.CLOUDSAVE){
					updateCloudRoomMsg(reqData)
				}
	
			})
		});
		//监听
		send('join', {}, 'broadcast')
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
					data['data']['status'] = 0
					Toast({ mes: `${data.data.nick_name}申请加你好友` });
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
			})
		});

		//监听单聊房间动态消息
		window.apiSocket.on('room', (data) => {
			response(data).then(res=>{
				let data = res.data
				console.log("房间列表"+data)
				store.dispatch('updateRoomList', data)
			})
		});
		//监听群聊房间动态消息
		window.apiSocket.on('groupRoom', (data) => {
			response(data).then(res=>{
				let data = res.data
				console.log(data)
				store.dispatch('updateGroupRoomList', data)
			})
		});
		//初始化好友邀请消息状态
		getAddressBookBeg().then(res=>{
			console.log("通讯录地址"+res)
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
		if (type == 'room') {
			//响应超时
			window.sendTimeOut = setTimeout(()=>{
				if(method == 'join'){
					Loading.open('房间加入超时,重新加入中...')
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
						Alert({'mes':'房间连接已断开'})
					}
				}
				if(method == 'leave'){
					Loading.open('房间退出超时,重新退出中...')
					if(window.tryRoomLinkCount<3){
						send('leave', {
							room_uuid: store.getters.currentRoomUuid
						})
						window.tryRoomLinkCount++
					}else{
						window.tryRoomLinkCount = 0
						clearTimeout(window.sendTimeOut)
						Loading.close()
						Alert({'mes':'房间连接已断开'})
					}
				}
				if(method == 'chat'){
					Toast({
						mes: '响应超时',
						timeout: 1500,
						icon: 'error'
					});
					let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
					let index = utils.arr.getIndexByTime(data.data['created_at'], msgList)
					msgList[index]['send_status'] = 2
					store.dispatch('updateMsgList', msgList)
				}
			},1500)
			let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
			window.apiSocket.emit(method, encryptStr, (recv)=>{
				console.log(recv)
				//未加入房间的时候对方收不到消息
				response(recv).then(res=>{
					if(res.data.action == 'chat'){
						clearTimeout(window.sendTimeOut)
					}
					if(res.data.action == 'leave'){
						clearTimeout(window.sendTimeOut)
						Loading.close()
						//如果不在room路由下
						if(router.history.current.fullPath.indexOf('room') == -1){
							store.commit('updateCurrentRoomUuid', '')
							store.commit('updateCurrentRoomName', '')
							store.commit('updateCurrentRoomType', store.getters.ALONECHAT)
							store.commit('updateCurrentRoomSaveAction', store.getters.LOCALSAVE)
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
					let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
					let index = utils.arr.getIndexByTime(data.data['created_at'], msgList)
					msgList[index]['send_status'] = 2
					store.dispatch('updateMsgList', msgList)
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
					Loading.open('广播重新链接中...')
					if(window.tryBroadcastLinkCount<3){
						send('join', {}, 'broadcast')
						window.tryBroadcastLinkCount++
					}else{
						window.tryBroadcastLinkCount = 0
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Alert({'mes':'广播连接已断开'})
					}
				}
				if(method == 'leave'){
					Loading.open('广播退出超时,重新退出中...')
					if(window.tryBroadcastLinkCount<3){
						send('leave', {}, 'broadcast')
						window.tryBroadcastLinkCount++
					}else{
						window.tryBroadcastLinkCount = 0
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Alert({'mes':'广播连接已断开'})
					}
				}
			},1500)
			data['type'] = store.getters.NOTIFICATION
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
				window.apiSocket.emit(method, encryptStr, (res)=>{
					console.log(res)
					/**
					* error为true时 显示msg提示信息
					*/
					if (res.error_code === 200) {
						resolve(res)
					}
					if (res.error_code === 400 || res.error_code === 500) {
						if(res.show == true){
							Toast({mes:res.msg})
						}
						Loading.close()
						reject('error')
					}
					if (res.error_code === 401 || res.error_code === 10001) {
						clearTimeout(window.sendTimeOut)
						clearTimeout(window.broadcastTimeOut)
						Loading.close()
						Toast({mes: res.msg})
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
			Toast({mes:res.msg})
		}
		Loading.close()
		reject(res)
		}
		if (res.error_code === 401|| res.error_code === 10001) {
			clearTimeout(window.sendTimeOut)
			clearTimeout(window.broadcastTimeOut)
			Loading.close()
			Toast({mes: res.msg})
			// 这里需要删除token，不然携带错误token无法去登陆
			window.localStorage.removeItem('token')
			store.commit('SET_TOKEN', null)
			router.push({name: 'authLogin'})
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
