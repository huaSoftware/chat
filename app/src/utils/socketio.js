
import store from '../store'
import router from '../router'
import utils from '@/utils/utils'
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { addAddressBookBeg, updateRoomMsg } from "@/utils/indexedDB"

/* 注册socketio */
export function setup() {
	// 创建添加新好友套接字连接
	if (window.roomSocket == undefined) {
		// 创建聊天室套接字监听
		window.roomSocket = io.connect(process.env.VUE_APP_CLIENT_API + '/room');
		window.roomSocket.on('join', (data) => {
			//逻辑处理
		});
		//监听回复的消息
		window.roomSocket.on('leave', (data) => {
			//逻辑处理
		});
		///监听回复的消息
		window.roomSocket.on('chat', (data) => {
			response(data).then(res=>{
				let data = res.data
				//逻辑处理,存放indexdDB,存放一份实时的在vuex
				let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
				let index = utils.arr.getIndexByTime(data['created_at'], msgList)
				msgList[index]['send_status'] = 1
				//console.log(data)
				store.dispatch('updateMsgList', msgList)
				updateRoomMsg(data['created_at'], 1)
			})
		});

		send('join', {}, 'broadcast')
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

/* 发送消息 
 * @param string data
 * @param object data
 * @return void
 */
export function send(method, data, type = 'room') {
	let token = store.getters.token
	data['Authorization'] = 'JWT '+token
	if (type == 'room') {
		//响应超时
		window.sendTimeOut = setTimeout(()=>{
			if(method == 'join'){
				Toast({
					mes: '加入超时',
					timeout: 1500,
					icon: 'error'
				});
			}
			if(method == 'leave'){
				Toast({
					mes: '退出超时',
					timeout: 1500,
					icon: 'error'
				});
			}
			if(method == 'chat'){
				Toast({
					mes: '响应超时',
					timeout: 1500,
					icon: 'error'
				});
				let msgList = JSON.parse(JSON.stringify(store.getters.msgList))
				console.log(method)
				let index = utils.arr.getIndexByTime(data.data['created_at'], msgList)
				msgList[index]['send_status'] = 2
				store.dispatch('updateMsgList', msgList)
			}
		},5000)
		window.roomSocket.emit(method, data, (recv)=>{
			clearTimeout(window.sendTimeOut)
			response(recv).then(res=>{
				if(res.data.action == 'chat'){

				}
				if(res.data.action == 'leave'){
					
				}
				if(res.data.action == 'join'){
					let queryData = {}
					store.commit('updateCurrentRoomUuid', data.room_uuid)
					store.commit('updateCurrentRoomName', data.name)
					store.commit('updateCurrentRoomType', data.type)
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
			router.push({name: 'authLogin'})
			reject('error')
		}
		reject('error')
	})
	return res
}
