
<template>
	<div class="content">
		<article class="yd-list yd-list-theme4">
			<a @click="handleJoinRoom(item)" href="javascript:;" class="yd-list-item" v-for=" (item, index) in roomList">
				<div class="yd-list-img"><img :src="item.users.head_img"></div>
				<div class="yd-list-mes">
					<div class="yd-list-title">
						<span class="title-left">{{item.users.nick_name}}</span>
						<span class="title-right">{{formatTime(item.updated_at)}}</span>
					</div>
					<div class="yd-list-other">
						<div><span class="demo-list-price" v-html="item.last_msg">{{item.last_msg}}</span></div>
						<!-- <div><yd-icon name="lingsheng" custom slot="icon" size="0.4rem"></yd-icon></div> -->
					</div>
				</div>
			</a>
		</article>
	</div>
</template>
<script>
	import {
		mapGetters, mapMutations
	} from 'vuex'
	import utils from '@/utils/utils'
	import {roomGet} from '@/api/room'

	export default {
		components: {},
		name: 'home',
		data() {
			return {
			}
		},
		computed: {
			...mapGetters([
				'navbarTitle',
				"roomList"
			])
		},
		methods: {
			...mapMutations({
				updateRoomList: 'updateRoomList'
			}),
			init(){
				roomGet({page_no:1, per_page:100000000}).then(res=>{
					this.updateRoomList(res.data.roomList)
				})
			},
			handleJoinRoom(item){
				window.roomSocket.emit('join',{
					name: item.users.nick_name,
					unread_number: 0,
					be_unread_number: 0,
					last_msg: '',
					be_focused_user_id: item.be_focused_user_id,
					focused_user_id: item.focused_user_id,
					is_alert: 0
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
	float:right;
	font-size:12px;
	width:30%;
	overflow: hidden;
	text-align: right;
}
.title-left{
	width:60%;
	overflow: hidden;
}
</style>