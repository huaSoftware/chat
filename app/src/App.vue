<!--
 * @Author: hua
 * @Date: 2019-02-01 13:57:47
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-07-17 16:57:44
 -->
<template>
  <yd-layout>
    <!-- 公共头部导航 -->
		<yd-navbar slot="navbar" :title="this.$route.meta.title" v-if="this.$route.meta.isShowHead">
			<a  href="javascript:;" @click="goHref" slot="left" v-if="this.$route.meta.isShowBack">
				<yd-navbar-back-icon ></yd-navbar-back-icon>	
			</a>
			<a href="javascript:;" @click="goHrefByDefPath" slot="right" v-if="this.$route.meta.isShowDef" style="color: rgb(153, 153, 153);">
				<span v-if="this.$route.meta.defIconName" :class="this.$route.meta.defIconName" style="font-size: 0.46rem;"></span>
				<span v-if="this.$route.meta.defTextName" style="font-size: 0.3rem;">{{this.$route.meta.defTextName}}</span>
			</a>
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
import { mapState, mapGetters, mapMutations} from "vuex";
import storage from "@/utils/localstorage"
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
import {addAddressBookBeg, addRoomMsg, updateMsg} from "@/utils/indexedDB"
import {joinChatSend} from '@/socketIoApi/chat'
import {setup} from '@/utils/socketio'
import utils from '@/utils/utils'
import router from './router'

export default {
  components: {},
  name: "app",
  created() {
    //刷新回首页
    this.$router.push('/');
    utils.h5Plus.bindPhysicsBack(null)
    //获取html节点的字体大小
    this.setHtmlFontSizeToVuex()
    if(this.user.token){
      setup()
      /* 断线重连 */
			document.addEventListener('visibilitychange',()=> {
				if(document.visibilityState=='hidden') {
				  this.hiddenTime = new Date().getTime()	//记录页面隐藏时间
				}else{
          let visibleTime = new Date().getTime();
          if((visibleTime-this.hiddenTime)/1000>10){	//页面再次可见的时间-隐藏时间>10S,重连
            if(typeof window.roomSocket.io == 'undefined'){
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
            console.log('主动关闭连接后重连');
            setTimeout(()=> {
              setup()    //打开连接，使用的vuejs，这是socketio的连接方法
            },1500);    //1.5S后重连
          }else{
            console.log('还没有到断开的时间')
          }
				}
			});
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      updateMsgList:'updateMsgList',
      updateRoomList: 'updateRoomList',
      updateHtmlFontSize: 'updateHtmlFontSize'
    }),
    goHref(){
      let path = router.currentRoute.meta.backPath
      if(path === -1){
        history.go(-1)
      }else{
        this.$router.push({name: path})
      }
    },
    goHrefByDefPath(){
      let path = router.currentRoute.meta.defPath
      if(path === -1){
        history.go(-1)
      }else if(path === null){
        return 
      }
      else{
        this.$router.push({name: path})
      }
    },
    setHtmlFontSizeToVuex(){
      let fontSize = document.getElementsByTagName('html')[0].style.fontSize
      this.updateHtmlFontSize(fontSize.slice(0, fontSize.length-2))
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      "msgList",
      "currentRoomUuid", 
      "currentRoomName",
      "currentRoomType"
    ]),
    ...mapState([
      'user'
    ])
  
  },
  data() {
    return {
      hiddenTime: 0,
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