<!--
 * @Author: hua
 * @Date: 2019-02-01 13:57:47
 * @description: 入口页面
 * @LastEditors: hua
 * @LastEditTime: 2020-04-18 08:50:43
 -->
<template>
  <yd-layout>
    <!-- 公共头部导航  todo 修改头-->
    <yd-navbar slot="navbar" :title="this.$route.meta.title" v-if="this.$route.meta.isShowHead">
      <a href="javascript:;" @click="goHref" slot="left" v-if="this.$route.meta.isShowBack">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
      <a
        href="javascript:;"
        @click="goHrefByDefPath"
        slot="right"
        v-if="this.$route.meta.isShowDef"
        style="color: rgb(153, 153, 153);"
      >
        <span
          v-if="this.$route.meta.defIconName"
          :class="this.$route.meta.defIconName"
          style="font-size: 0.46rem;"
        ></span>
        <span
          v-if="this.$route.meta.defTextName"
          style="font-size: 0.3rem;"
        >{{this.$route.meta.defTextName}}</span>
      </a>
    </yd-navbar>
    <transition :name="$store.state.routerStatus.transition" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="$store.state.routerStatus.transition" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <!-- html通知消息 -->
    <notify></notify>
    <!-- 悬浮 -->
    <navMenu></navMenu>
    <!--公共底部导航-->
    <yd-tabbar slot="tabbar" v-if="this.$route.meta.isShowFoot">
      <yd-tabbar-item
        :title="item.name"
        type="link"
        :link="item.router"
        v-for="(item, index) in footerMenu"
        :key="index"
        :class="$store.state.appData.navbarTitle == item.name? 'active': ''"
      >
        <yd-icon
          :name="$store.state.appData.navbarTitle == item.name? item.iconActive: item.icon"
          custom
          slot="icon"
          size="0.54rem"
        ></yd-icon>
        <yd-badge
          slot="badge"
          type="danger"
          v-if="item.name=='消息' && (msgAlertNumber+groupMsgAlertNumber) > 0"
        >{{msgAlertNumber+groupMsgAlertNumber}}</yd-badge>
        <yd-badge
          slot="badge"
          type="danger"
          v-if="item.name=='我的' && newFriendAlertNumber > 0"
        >{{newFriendAlertNumber}}</yd-badge>
      </yd-tabbar-item>
    </yd-tabbar>
  </yd-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import storage from "@/utils/localstorage";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";
import { addressBookBegCache } from "@/socketioApi/addressBook";
import {
  addAddressBookBeg,
  getAddressBookBeg,
  updateMsg
} from "@/utils/indexedDB";
import { setDown, setup, setupListen } from "@/utils/socketio";
import { getConst } from "@/socketioApi/config";
import utils from "@/utils/utils";
import router from "./router";
import navMenu from "@/components/nav-menu/nav-menu";
import notify from "@/components/notify/notify";
import eruda from "eruda";

export default {
  components: { navMenu, notify },
  name: "app",
  created() {
    //eruda.init()
    let that = this;
    //刷新回首页
    this.$router.push("/");
    utils.h5Plus.bindPhysicsBack(null);
    //获取html节点的字体大小
    this.setHtmlFontSizeToVuex();
    //注册socketio
    setup();
    //拉取配置常量
    getConst().then(res => {
      console.log(res);
      this.$store.commit("updateState", res.data);
      //检测是否监听断开
      setInterval(() => {
        if (window.apiSocket !== undefined) {
          if (
            window.apiSocket._callbacks.$beg == undefined ||
            window.apiSocket._callbacks.$chat == undefined ||
            window.apiSocket._callbacks.$connect == undefined ||
            window.apiSocket._callbacks.$connecting == undefined ||
            window.apiSocket._callbacks.$disconnect == undefined ||
            window.apiSocket._callbacks.$groupRoom == undefined ||
            window.apiSocket._callbacks.$join == undefined ||
            window.apiSocket._callbacks.$leave == undefined ||
            window.apiSocket._callbacks.$room == undefined ||
            window.apiSocket._callbacks.$send == undefined
          ) {
            setupListen();
          }
        }
      }, res.data.TIME.TIME_OUT.value); //超时时间动态设置
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState == "hidden") {
          this.hiddenTime = new Date().getTime(); //记录页面隐藏时间
        } else {
          let visibleTime = new Date().getTime();
          if ((visibleTime - this.hiddenTime) / 1000 > 10) {
            //页面再次可见的时间-隐藏时间>10S,重连
            setDown();
            console.log("主动关闭连接后重连");
            setTimeout(() => {
              setup(); //打开连接，使用的vuejs，这是socketio的连接方法
            }, 1500); //1.5S后重连
          } else {
            console.log("还没有到断开的时间");
          }
        }
      });
      //app的监听事件
      document.addEventListener(
        "plusready",
        function() {
          //运行环境从前台切换到后台事件
          document.addEventListener("pause", onAppPause, false);
          //运行环境从后台切换到前台事件
          document.addEventListener("resume", onAppReume, false);
          //应用切换到后台运行事件
          document.addEventListener("background", onAppBackground, false);
          //应用切换到前台运行事件
          document.addEventListener("foreground", onAppForeground, false);
          //应用需要清理内存事件
          document.addEventListener("trimmemory", onAppTrimMemory, false);
        },
        false
      );
      function onAppPause() {
        console.log("Application paused!");
        that.$store.commit("updateIsPaused", true);
      }
      function onAppReume() {
        console.log("Application resumed!");
        that.$store.commit("updateIsPaused", false);
      }
      function onAppBackground() {
        console.log("Application background!");
      }
      function onAppForeground(e) {}
      function onAppTrimMemory() {
        console.log("Trim Memory!");
      }
      if (this.user.token) {
        addressBookBegCache().then(res => {
          let data = res.data;
          if (JSON.stringify(data) !== "{}") {
            // 复制原来的值
            data["data"]["user_id"] = data["data"]["id"];
            // 删除原来的键
            delete data["data"]["id"];
            // 增加状态,0申请，1通过，2拒绝
            data["data"]["status"] = 0;
            Toast({ mes: `${data.data.nick_name}申请加你好友` });
            addAddressBookBeg(data["data"]).then(res => {
              getAddressBookBeg().then(res => {
                let newFriendAlertNumber = 0;
                console.log("通讯录地址" + res);
                if (!res) return;
                if (res.length > 0) {
                  res.forEach(item => {
                    if (item.status == 0) {
                      newFriendAlertNumber++;
                    }
                  });
                }
                store.commit(
                  "updateNewFriendAlertNumber",
                  newFriendAlertNumber
                );
              });
            });
          }
        });
      }
    });
  },
  mounted() {},
  methods: {
    ...mapGetters(["TIME"]),
    ...mapMutations({
      updateMsgList: "updateMsgList",
      updateRoomList: "updateRoomList",
      updateHtmlFontSize: "updateHtmlFontSize"
    }),
    goHref() {
      let path = router.currentRoute.meta.backPath;
      if (path === -1) {
        this.$router.back();
        return;
      } else {
        this.$router.push({ name: path });
      }
    },
    goHrefByDefPath() {
      let path = router.currentRoute.meta.defPath;
      if (path === -1) {
        this.$router.go(-1);
      } else if (path === null) {
        return;
      } else {
        console.log(path);
        this.$router.push({ name: path });
      }
    },
    setHtmlFontSizeToVuex() {
      let fontSize = document.getElementsByTagName("html")[0].style.fontSize;
      this.updateHtmlFontSize(fontSize.slice(0, fontSize.length - 2));
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      "msgList",
      "currentRoomUuid",
      "currentRoomName",
      "currentRoomType",
      "currentRoomSaveAction",
      "msgAlertNumber",
      "groupMsgAlertNumber",
      "newFriendAlertNumber"
    ]),
    ...mapState(["user"])
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
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
.yd-navbar {
  /* 	height:1.4rem !important;
	padding-top:0.4rem !important; */
}

.yd-navbar + div {
  padding-top: 1rem;
}
.fade-enter-active {
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  opacity: 1;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
/*过渡动画*/
/*下一页*/
.next-enter-active {
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  opacity: 1;
  position: fixed;
  width: 100vw;
}

.next-enter,
.next-leave-active {
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
  width: 100vw;
}

.prev-enter,
.prev-leave-active {
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
.active {
  color: $color-primary !important;
}
</style>