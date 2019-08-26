
import store from '../store'
import router from '../router'
import utils from '@/utils/utils'
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { addAddressBookBeg, updateRoomMsg } from "@/utils/indexedDB"
import {roomMsgUpdate} from "@/api/room"

/* 注册socketio */
export function setup() {
	// 创建添加新好友套接字连接
	if (window.roomSocket == undefined) {
		// 创建聊天室套接字监听
		window.roomSocket = io.connect(process.env.VUE_APP_CLIENT_SOCKET + '/room');
		window.roomSocket.on('join', (data) => {
			//逻辑处理
		});
		//监听回复的消息
		window.roomSocket.on('leave', (data) => {
			//逻辑处理
		});
		///监听回复的消息
		window.roomSocket.on('chat', (data) => {
			// 回复根据标志分类todo
			response(data).then(res=>{
				let data = res.data
				//逻辑处理,存放indexdDB,存放一份实时的在vuex
				let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
				let index = utils.arr.getIndexByTime(data['created_at'], msgList)
				//console.log(index);//未找到索引说明是他人发送的消息
				if(typeof index !== 'undefined'){
					msgList[index]['send_status'] = 1
				}else{
					msgList = msgList.concat(data)
				}
				//console.log(data)
				store.dispatch('updateMsgList', msgList)
				let reqData = {
					room_uuid :data['room_uuid'],
					created_at :data['created_at'],
					send_status: 1
				}
				if(store.getters.currentRoomSaveAction == 0){
					updateRoomMsg(reqData)
				}else if(store.getters.currentRoomSaveAction == 1){
					roomMsgUpdate(reqData)
				}
	
			})
		});

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
		window.roomSocket.on('beg', (data) => {
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
					addAddressBookBeg(data['data'])
				}
				if (data['action'] == 'beg_success') {
					Toast({ mes: '发送成功，对方已收到申请' });
				}
				if(data['action'] == 'beg_add_success' ){
					Toast({ mes: '对方已同意添加好友' });
				}
			})
		});

		//监听单聊房间动态消息
		window.roomSocket.on('room', (data) => {
			response(data).then(res=>{
				let data = res.data
				//console.log(data)
				store.dispatch('updateRoomList', data)
			})
		});
		//监听群聊房间动态消息
		window.roomSocket.on('groupRoom', (data) => {
			response(data).then(res=>{
				let data = res.data
				//console.log(data)
				store.dispatch('updateGroupRoomList', data)
			})
		});
	}
}

/* 注销socketio */
export function setDown(){
	if(typeof window.roomSocket == 'undefined'){
	window.roomSocket = io.connect(process.env.VUE_APP_CLIENT_API + '/room');
	}
	window.roomSocket.io.disconnect();    //先主动关闭连接
	//删除所有监听
	for(var listener in window.roomSocket.$events){
		if(listener != undefined){
			window.roomSocket.removeAllListeners(listener);
		}
	}
	window.roomSocket = undefined
}
/* 发送消息 
 * @param string data
 * @param object data
 * @return void
 */
export function send(method, data, type = 'room') {
	if(typeof window.roomSocket !== 'undefined'){
		let token = store.getters.token
		data['Authorization'] = 'JWT '+token
		if (type == 'room') {
			//响应超时
			window.sendTimeOut = setTimeout(()=>{
				if(method == 'join'){
					Loading.open('加入超时,重新加入中...')
					send('join', {
						name: store.getters.currentRoomName,
						room_uuid: store.getters.currentRoomUuid,
						type: store.getters.currentRoomType
					})
				}
				if(method == 'leave'){
					Loading.open('退出超时,重新推出中...')
					send('leave', {
						room_uuid: store.getters.currentRoomUuid
					})
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
			window.roomSocket.emit(method, data, (recv)=>{
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
							store.commit('updateCurrentRoomType', 0)
							store.commit('updateCurrentRoomSaveAction', 0)
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
						})
					}
				}).catch(e=>{
					//服务器出错
				})
			})
		}
		if (type == 'broadcast') {
			data['type'] = 2
			window.roomSocket.emit(method, data, (recv)=>{
				response(recv).then(res=>{
					if(res.data.action == 'leave'){	
					}
					if(res.data.action == 'join'){				
					}
				}).catch(e=>{
					//服务器出错
				})
			})
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
			if(typeof res.msg == 'object'){
				let msg = ''
				Object.keys(res.msg).forEach(function(key){
					res.msg[key].forEach(function(val, index) {
					msg = msg + val + ',';
					});
				});
				Toast({mes:msg.slice(0,msg.length-1)})
			}else{
				Toast({mes:res.msg})
			}
		}
		Loading.close()
		reject('error')
		}
		if (res.error_code === 401) {
			Loading.close()
			reject('error')
		}
		if (res.error_code === 10001) {
			Loading.close()
			Toast({mes: res.msg})
			// 这里需要删除token，不然携带错误token无法去登陆
			window.localStorage.removeItem('token')
			store.commit('SET_TOKEN', null)
			setDown()
			router.push({name: 'authLogin'})
			reject('error')
		}
		reject('error')
	})
	return res
}
