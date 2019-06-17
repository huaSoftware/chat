<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:47
 * @description: 首页
 * @LastEditors: hua
 * @LastEditTime: 2019-06-06 16:15:30
 -->

<template>
	<div class="content">
		<!-- 头部开始 -->
		<header  class="yd-navbar" style="background-color: rgb(255, 255, 255); height: 1rem; color: rgb(228, 228, 228);">
			<div class="yd-navbar-item"></div> 
			<div class="yd-navbar-center-box" style="height: 1rem;">
				<div class="yd-navbar-center">
					<span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;">消息</span>
				</div>
			</div> 
			<div class="yd-navbar-item"  @click="defShow=!defShow">
				<!-- <span class="icon-custom-8888 navbar_icon"></span> -->
				<span class="icon-custom-jia2 navbar_icon"></span>
			</div>
		</header>
		<!-- 头部结束 -->
		<!-- 功能栏 -->
		<yd-actionsheet :items="defs" v-model="defShow" cancel="取消"></yd-actionsheet>
		<!-- 单聊 -->
		<article class="yd-list yd-list-theme4">
			<a @click="handleJoinRoom(item)" href="javascript:;" class="yd-list-item" v-for=" (item, index) in roomList" :key="index">
				<div class="yd-list-img"><img :src="item.users.head_img"></div>
				<div class="yd-list-mes">
					<div class="yd-list-title">
						<span class="title-left">{{item.users.nick_name}}</span>
						<span class="title-right">{{formatTime(item.room.updated_at)}}</span>
					</div>
					<div class="yd-list-other">
						<div><span class="demo-list-price" v-html="formatLastMsg(item.room.last_msg)"></span></div>
						<!-- <div><yd-icon name="lingsheng" custom slot="icon" size="0.4rem"></yd-icon></div> -->
						<div  v-if="alert"><yd-badge v-if="item.unread_number" type="danger">{{item.unread_number}}</yd-badge></div>
					</div>
				</div>
			</a>
		</article>
		<!-- 群聊 -->
		<article class="yd-list yd-list-theme4">
			<a @click="handleJoinGroupRoom(item)" href="javascript:;" class="yd-list-item" v-for=" (item, index) in groupRoomList" :key="index">
				<div class="yd-list-img"><img src="@/assets/img/default.jpg"/></div>
				<div class="yd-list-mes">
					<div class="yd-list-title">
						<span class="title-left">{{item.room.name}}</span>
						<span class="title-right">{{formatTime(item.room.updated_at)}}</span>
					</div>
					<div class="yd-list-other">
						<div><span class="demo-list-price" v-html="formatLastMsg(item.room.last_msg)"></span></div>
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
	import {mapGetters, mapMutations} from 'vuex'
	import utils from '@/utils/utils'
	import {roomGet} from '@/api/room'
	import storage from "@/utils/localstorage"
	import {addAddressBookBeg, addRoomMsg, updateMsg} from "@/utils/indexedDB"
	import {addressBookCacheGet} from '@/api/addressBook'
	import {userRoomRelationGet} from '@/api/userRoomRelation'
	import {setup, send} from '@/utils/socketio'

	export default {
		components: {},
		name: 'home',
		data() {
			return {
				user:{},
				alert: true,
				loading: true,
				defShow: false,
                defs: [
                    {
                        label: '发起群聊',
                        callback: () => {
							this.$router.push({name:'groupChat'})
                        }
                    },
                    {
                        label: '添加朋友',
                        callback: () => {
							this.$router.push({name:'search'})
                        }
                    }
                ]
			}
		},
		computed: {
			...mapGetters([
				'navbarTitle',
				'roomList',
				'msgList',
				'groupRoomList'
			])
		},
		methods: {
			...mapMutations({
				updateRoomList: 'updateRoomList',
				updateGroupRoomList: 'updateGroupRoomList',
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
					if(res.data != null){
						this.updateRoomList(res.data)
						this.loading = false
					}
				})
				userRoomRelationGet({page_no:1, per_page:100000000}).then(res=>{
					this.updateGroupRoomList(res.data.list)
					this.loading = false
				})
				addressBookCacheGet().then(res=>{
					if(res.data == null){
						return
					}
					this.$dialog.toast({mes: `有新朋友加你好友，请去个人界面确认`});
					res.data.forEach(element => {
						element['user_id'] = element['id'];
						// 删除原来的键
						delete element['id'];
						// 增加状态,0申请，1通过，2拒绝
						element['status'] = 0
						addAddressBookBeg(element)
					});
				})
				setup()
			},
			handleJoinRoom(item){
				send('join',{
					name: item.users.nick_name,
					room_uuid: item.room_uuid,
					type: item.room.type
				})
				this.$router.push({
					name: 'room',
					query:{
						room_uuid: item.room_uuid,
						name: item.users.nick_name
					}
				})
			},
			handleJoinGroupRoom(item){
				send('join',{
					name: item.room.name,
					room_uuid: item.room_uuid,
					type: item.room.type
				})
				this.$router.push({
					name: 'room',
					query:{
						room_uuid: item.room_uuid,
						name: item.room.name
					}
				})
			},
			formatTime(value){
				return utils.time.formatDate(value, 'hh:mm:ss')
			},
			formatLastMsg(last_msg){
				if(last_msg.indexOf("preview") != -1 ){
					return '[图片]'
				}
				if(last_msg.indexOf("<img") != -1 ){
					return '[图片]'
				}
				return last_msg
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
.yd-navbar {
	height:1.4rem !important;
	padding-top:0.4rem !important;
}
.navbar_icon{
	color: rgb(92, 92, 92);
    font-size: 0.45rem;
	margin-left:0.3rem;
}
</style>