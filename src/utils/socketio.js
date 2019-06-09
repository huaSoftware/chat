
import storage from "@/utils/localstorage"
import store from '../store'
import router from '../router'
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { addAddressBookBeg, addRoomMsg, updateMsg } from "@/utils/indexedDB"


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


/* 注册socketio */
export function setup() {
	// 创建添加新好友套接字连接
	let userId = storage.get('user')['id']
	if (userId && window.broadcastSocket == undefined) {
		//命名空间用于广播，房间用于单人，命名空间时广播无效
		window.broadcastSocket = io.connect(process.env.VUE_APP_CLIENT_API + '/broadcast');
		send('join', {}, 'broadcast')
		//监听好友请求
		window.broadcastSocket.on('beg', (data, callback) => {
			response(data).then(res=>{
				let data = res.data
				//console.log(data)
				if (data['action'] == 'beg_add') {
					callback(data)
					// 复制原来的值
					data['data']['user_id'] = data['data']['id'];
					// 删除原来的键
					delete data['data']['id'];
					// 增加状态,0申请，1通过，2拒绝
					data['data']['status'] = 0
					this.$dialog.toast({ mes: `${data.data.nick_name}申请加你好友` });
					addAddressBookBeg(data['data'])
				}
				if (data['action'] == 'beg_success') {

					this.$dialog.toast({ mes: '发送成功，对方已收到申请' });
				}
			})
		});

		//监听单聊房间动态消息
		window.broadcastSocket.on('room', (data) => {
			response(data).then(res=>{
				let data = res.data
				console.log(data)
				store.dispatch('updateRoomList', data)
			})
		});
		//监听群聊房间动态消息
		window.broadcastSocket.on('groupRoom', (data) => {
			response(data).then(res=>{
				let data = res.data
				console.log(data)
				store.dispatch('updateGroupRoomList', data)
			})
		});
	}
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
				console.log(data)
				//逻辑处理,存放indexdDB,存放一份实时的在vuex
				let msgList = []
				Object.assign(msgList, store.getters.msgList)
				msgList = msgList.concat(data)
				store.dispatch('updateMsgList', msgList)
				addRoomMsg(data)
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
		window.roomSocket.emit(method, data)
	}
	if (type == 'broadcast') {
		window.broadcastSocket.emit(method, data)
	}
}