
<template>
	<div class="content">
		<article class="yd-list yd-list-theme4">
			<a @click="handleJoinRoom(item)" href="javascript:;" class="yd-list-item" v-for=" (item, index) in roomList">
				<div class="yd-list-img"><img :src="item.users.head_img"></div>
				<div class="yd-list-mes">
					<div class="yd-list-title">
						<span class="title-left">{{item.users.nick_name}}</span>
						<span class="title-right">{{formatTime(item.room.updated_at)}}</span>
					</div>
					<div class="yd-list-other">
						<div><span class="demo-list-price" v-html="item.room.last_msg">{{item.room.last_msg}}</span></div>
						<!-- <div><yd-icon name="lingsheng" custom slot="icon" size="0.4rem"></yd-icon></div> -->
						<div  v-if="alert"><yd-badge v-if="item.unread_number" type="danger">{{item.unread_number}}</yd-badge></div>
					</div>
				</div>
			</a>
		</article>
		<img style="width:100%;height:100%;padding:0 70px 70px 70px;position:absolute;z-index:100;top: 0rem;background:#fff;" src="@/assets/loading-bars.svg" v-if="loading" />
		<!-- 参数空时页面 -->
		<div class="empty" v-if="roomList.length==0 && loading==false">
			<span class="icon-custom-xiaoxi"></span>
			<span class="empty_text">暂无消息</span>
		</div>
	</div>
</template>
<script>
	import {
		mapGetters, mapMutations
	} from 'vuex'
	import utils from '@/utils/utils'
	import {roomGet} from '@/api/room'
	import storage from "@/utils/localstorage"
	import {addAddressBookBeg, addRoomMsg, updateMsg} from "@/utils/indexedDB"
	import {addressBookCacheGet} from '@/api/addressBook'

	export default {
		components: {},
		name: 'home',
		data() {
			return {
				user:{},
				alert: true,
				loading: true
			}
		},
		computed: {
			...mapGetters([
				'navbarTitle',
				'roomList',
				'msgList'
			])
		},
		methods: {
			...mapMutations({
				updateRoomList: 'updateRoomList',
				updateMsgList:'updateMsgList'
			}),
			init(){
				this.user = storage.get('user')
				if(window.localStorage.getItem('alert') == undefined){
					this.alert = true
				}else{
					this.alert = storage.get('alert')
				}
				roomGet({page_no:1, per_page:100000000}).then(res=>{
					this.updateRoomList(res.data)
					this.loading = false
				})
				addressBookCacheGet().then(res=>{
					//console.log(res.data)
					if(res.data.length > 0){
						this.$dialog.toast({mes: `有新朋友加你好友，请去个人界面确认`});
					}
					res.data.forEach(element => {
						element['user_id'] = element['id'];
						// 删除原来的键
						delete element['id'];
						// 增加状态,0申请，1通过，2拒绝
						element['status'] = 0
						addAddressBookBeg(element)
					});
				})

				// 创建添加新好友套接字连接
				let userId = storage.get('user')['id']
				if(userId && window.broadcastSocket == undefined){
					//命名空间用于广播，房间用于单人，命名空间时广播无效
					window.broadcastSocket = io.connect(process.env.VUE_APP_CLIENT_API+'/broadcast');
					window.broadcastSocket.emit('join',{       
						user_id: userId 
					})
					//监听好友请求
					window.broadcastSocket.on('beg',(data, callback)=>{
						console.log(data)
						if(data['action'] == 'beg_add'){
							callback(data)
							// 复制原来的值
							data['data']['user_id'] = data['data']['id'];
							// 删除原来的键
							delete data['data']['id'];
							// 增加状态,0申请，1通过，2拒绝
							data['data']['status'] = 0
							this.$dialog.toast({mes: `${data.data.nick_name}申请加你好友`});
							addAddressBookBeg(data['data'])
						}
						if(data['action'] == 'beg_success'){

							this.$dialog.toast({mes: '发送成功，对方已收到申请'});
						}
					});

					//监听房间动态消息
					window.newFriendSocket.on('room',(data)=>{
						console.log(data)
						this.updateRoomList(data)
					});
				}
				if(window.roomSocket == undefined){
					// 创建聊天室套接字监听
					window.roomSocket = io.connect(process.env.VUE_APP_CLIENT_API+'/room');
					window.roomSocket.on('join',(data)=>{
					//逻辑处理
					});			
					//监听回复的消息
					window.roomSocket.on('leave',(data)=>{
					//逻辑处理
					});		
					///监听回复的消息
					window.roomSocket.on('chat',(data)=>{
						//逻辑处理,存放indexdDB,存放一份实时的在vuex
						let msgList = []
						console.log(this.msgList)
						Object.assign(msgList, this.msgList)
						msgList = msgList.concat(data.data)
						this.updateMsgList(msgList)
						addRoomMsg(data.data)
						//console.log(this.msgList)
					});
				}
			},
			handleJoinRoom(item){
				window.roomSocket.emit('join',{
					name: item.users.nick_name,
					room_uuid: item.room_uuid
				})
				this.$router.push({
					name: 'room',
					query:{
						room_uuid: item.room_uuid
					}
				})
			},
			formatTime(value){
				return utils.time.formatDate(value, 'hh:mm:ss')
			}
		},
		created() {
			this.init()
		},
		mounted() {}
	}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
.yd-list-theme4 .yd-list-item .yd-list-img {
	width: 1.2rem;
	padding: 0.6rem 0;
}

.yd-list-theme4 .yd-list-item .yd-list-title {
	line-height: 0.6rem;
}
.title-right{
	font-weight: normal;
	display: inline-block;
	font-size:12px;
	width:40%;
	overflow: hidden;
	text-align: right;
}
.title-left{
	width:60%;
	overflow: hidden;
	display: inline-block;
}
.yd-list-title{
    line-height: 0.4rem!important;
}
/* 页面为空时 */
.empty {
    width: 100%;
	height: 100%;
	z-index:2;
	position: relative;
}
.icon-custom-xiaoxi{
	font-size: 2rem;
	position: relative;
	display: block;
	text-align: center;
	padding-top:50%;
}
.icon-custom-xiaoxi:before {
	color:#aaaaaa;
}
.empty_text{
	width:100%;
	display: block;
	text-align: center;
	color:#aaaaaa;
	font-size: 0.56rem;
	margin-top:0.2rem;
}
</style>