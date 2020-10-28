<!--
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-10-28 20:53:44
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import storage from "@/utils/localstorage";
import { addressBookBegCache } from "@/socketioApi/addressBook";
import {
  addAddressBookBeg,
  getAddressBookBeg,
  updateMsg
} from "@/utils/indexedDB";
import { Message } from "element-ui";
import { setDown, setup, setupListen } from "@/utils/socketio";
import { getConst } from "@/socketioApi/config";
import utils from "@/utils/utils";
import router from "./router";
export default {
  name: "App",
  created() {
    //eruda.init()
    let that = this;
    //刷新回首页
    this.$router.push("/");
    utils.h5Plus.bindPhysicsBack(null);
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
      if (this.user.token) {
        addressBookBegCache().then(res => {
          let data = res.data.data;
          if(JSON.stringify(data) !== '{}'){
            return
          }
          data.user_id = res.data.focused_user_id
          // 增加状态,0申请，1通过，2拒绝
          data.status = 0;
          console.log(data);
          Message({
            message:`${data.data.nick_name}申请加你好友`,
            type: "success",
            duration: 5 * 1000,
          });
          addAddressBookBeg(data["data"]);
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
            store.commit("updateNewFriendAlertNumber", newFriendAlertNumber);
          });
        });
      }
    });
  },
  computed: {
    ...mapGetters([
      "TIME",
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
  methods: {
    ...mapMutations({
      updateMsgList: "updateMsgList",
      updateRoomList: "updateRoomList",
      updateHtmlFontSize: "updateHtmlFontSize"
    }),
  }
};
</script>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  padding-right:0px!important;
}
</style>
<style lang="scss">
@import "./assets/custom-theme/index.css";
@import "./styles/index.scss"; // 全局自定义的css样式
</style>
