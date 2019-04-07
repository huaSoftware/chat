<template>
  <yd-layout>
    <!-- 公共头部导航 -->
		<yd-navbar slot="navbar" :title="this.$route.meta.title" v-if="this.$route.meta.isShowHead">
			<router-link :to="{name: this.$route.meta.backPath}" slot="left" v-if="this.$route.meta.isShowBack">
				<yd-navbar-back-icon ></yd-navbar-back-icon>
			</router-link>
			<router-link :to="{name:this.$route.meta.defPath}" slot="right" v-if="this.$route.meta.isShowDef" style="color: rgb(92, 92, 92);">
				{{this.$route.meta.defName}}
			</router-link>
    	</yd-navbar>
		<router-view ></router-view>
    <!--公共底部导航-->
		<yd-tabbar slot="tabbar"  v-if="this.$route.meta.isShowFoot">
			<yd-tabbar-item :title="item.name" type="link" :link="item.router" v-for="(item, index) in footerMenu" :key="index" :class="$store.state.appData.navbarTitle == item.name? 'active': ''">
				<yd-icon :name="$store.state.appData.navbarTitle == item.name? item.iconActive: item.icon" custom slot="icon" size="0.54rem"></yd-icon>
			</yd-tabbar-item>
    	</yd-tabbar>
    </yd-layout>
</template>

<script>
import { mapGetters, mapMutations} from "vuex";
import storage from "@/utils/localstorage"
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
import {addAddressBookBeg, addRoomMsg, updateMsg} from "@/utils/indexedDB"

export default {
  components: {},
  name: "app",
  created() {
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
      window.broadcastSocket.on('room',(data)=>{
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
  mounted() {
  },
  methods: {
    ...mapMutations({
      updateMsgList:'updateMsgList',
      updateRoomList: 'updateRoomList'
    })
  },
  watch: {},
  computed: {
    ...mapGetters(["msgList"])
  },
  data() {
    return {
      footerMenu: [
        {
          icon: "xiaoxi",
          iconActive: "xiaoxi_active",
          name: "消息",
          router: "/home"
        },
        {
          icon: "tongxunlu",
          iconActive: "tongxunlu_active",
          name: "通讯录",
          router: "/addressBook"
        },
       /*  {
          icon: "zixun",
          iconActive: "zixun2",
          name: "我的",
          router: "/serverManager"
        }, */
        {
          icon: "wode",
          iconActive: "wode_active",
          name: "我的",
          router: "/my"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/base.scss';
  @import '@/assets/scss/public.scss';
.yd-navbar {
	height:1.4rem !important;
	padding-top:0.4rem !important;
}

.yd-navbar + div{
	padding-top: 1rem;
}
.fade-enter-active {
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
    opacity: 1
}

.fade-enter, .fade-leave-active {
    opacity: 0;
}
/*过渡动画*/
/*下一页*/
.next-enter-active {
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
    opacity: 1;
    position: fixed;
    width:100vw;
}

.next-enter, .next-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(50%, 0, 0);
    transform: translate3d(50%, 0, 0);
}

.next-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
/*上一页*/
.prev-enter-active {
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
    width:100vw;
}

.prev-enter, .prev-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
}

.prev-active {
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}

/* 底部选中 */
.active{
    color:$color-primary !important;
}

</style>