<!--
 * @Author: hua
 * @Date: 2019-02-26 09:08:43
 * @LastEditors: hua
 * @LastEditTime: 2019-08-16 14:37:37
 -->
<template>
  <div style="font-size: 0;" id="msg_empty">
    <!-- 内容 -->
    <mescroll-vue  :down="mescrollDown"  @init="mescrollInit"   @touchstart="closeDefIconsShow()">
      <div class="mscroll-container">
        <div v-show="moreInfoShow" class="more_info" @click="$router.push({name: 'roomMsgList'})">
          更多消息，请<span class="primary_color">打开消息记录</span>
        </div>
        <ul>
          <li v-for="(key, index) in msgList" :key="index">
            <div class="chat-item" v-if="key.user_id == userInfo.id">
              <div class="mychat">
                <vImg :imgUrl="key.head_img"  class="img" />
                <div class="nt">
                  <span v-html="key.name"></span>
                </div>
                <div v-if="key.type == 0" class="msg" @touchstart="amrPlay(key.msg, index)">
                  <vImg class="vioce_start" style="margin-right:-3px" :imgUrl="'static/img/voice_left.gif'" v-show="key.status"/>
                  <i class="vioce_stop_left" v-show="!key.status"></i>
                  <span class="vioce_second">{{key.duration}}s</span>
                </div>
                <div v-else-if="key.type == 1" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div v-else class="msg" v-html="key.msg"></div>
                <!-- 消息送达状态 -->
                <span v-if="key.send_status == 0 " class="send_status loading_color rotate_loading">
                  <yd-icon name="refresh"></yd-icon>
                </span>
                <span
                  @click="reSendMsg(key.created_at)"
                  v-if="key.send_status == 2"
                  class="send_status color_danger"
                >
                  <yd-icon name="error"></yd-icon>
                </span>
              </div>
            </div>
            <div class="chat-item" v-else>
              <div class="otherchat">
                <vImg class="img" :imgUrl="key.head_img" />
                <div class="nt">
                  <span v-html="key.name"></span>
                </div>
                <div v-if="key.type == 0" class="msg" @touchstart="amrPlay(key.msg, index)">
                  <vImg
                    class="chat_right vioce_start"
                    :imgUrl="'static/img/voice_right.gif'"
                    v-show="key.status"
                  />
                  <i class="vioce_stop_right" v-show="!key.status"></i>
                  <span class="vioce_second">{{key.duration}}s</span>
                </div>
                <div v-else-if="key.type == 1" class="rawMsg" v-html="key.msg"></div>
                <div v-else class="msg" v-html="key.msg"></div>
              </div>
            </div>
          </li>
        </ul>
        <!-- 暂无消息 -->
        <vEmpty v-if="msgList.length==0"></vEmpty>
      </div>
    </mescroll-vue>
    <!-- 语音输入gif图 -->
    <vImg v-show="recordingShow" class="recording" :imgUrl="'static/img/recording.gif'"/>
    <!-- 输入 -->
    <inputWrapper :style="iconsShow || defsShow ?'bottom:200px':'bottom:0.2rem'"
      @handleRecordShow="handleRecordShow"
      @closeDefIconsShow="closeDefIconsShow"
      @handleIconsShow="handleIconsShow"
      @handleDefsShow="handleDefsShow"
      @sendMsg="sendMsg"
      @handleImgOnChange="handleImgOnChange"
      @handleFileOnChange="handleFileOnChange"
      @handleContent="handleContent"
      :recordShow="recordShow"
      :content="content"
      :touched="touched"
      :sendShow="sendShow"></inputWrapper>
    <!-- 表情 -->
    <icons @recInsertIcon="insertIcon" v-if="iconsShow"/>
    <!-- 功能栏 -->
    <def v-show="defsShow"/>
    <!-- 裁剪图 -->
    <cropperBox v-if="cropperShow" :reqImgData="reqImgData" @recReqImgData="recReqImgData"  @recCropperShow="recCropperShow"/>   
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import vImg from '@/components/v-img/v-img'
import vEmpty from '@/components/v-empty/v-empty'
import inputWrapper from './components/input-wrapper/input-wrapper'
import icons from './components/icons/icons'
import def from './components/def/def'
import cropperBox from './components/cropperBox/cropperBox'
import MescrollVue from "mescroll.js/mescroll.vue"
import { uploadFile } from "@/api/common";
import utils from "@/utils/utils";
import storage from "@/utils/localstorage";
import { getRoomMsg } from "@/utils/indexedDB";
import {roomMsgGet} from '@/api/room'
import {Confirm,Alert,Toast,Notify,Loading} from "vue-ydui/dist/lib.rem/dialog";
import { send } from "@/utils/socketio";
import { chatSend, reChatSend } from "@/socketIoApi/chat";
export default {
  components: {
    MescrollVue, vImg, icons, def, cropperBox, vEmpty, inputWrapper
  },
  computed: {
    ...mapGetters(["msgList", "currentRoomUuid", "currentRoomName", "userInfo", "htmlFontSize", "currentRoomSaveAction"])
  },
  data() {
    return {
      uuidVal: "",
      scroll: "",
      content: "",
      iconsShow: false,
      defsShow: false,
      sendShow: false,
      recordShow: false,
      recordingShow: false,
      touched: false,
      cropperShow: false,
      lockDown: false,
      moreInfoShow: false,
      data: [],
      reqImgData: {
        url: process.env.VUE_APP_CLIENT_API,
        imgDatas: ""
      },
      mescroll: null, // mescroll实例对象
      mescrollDom: null,
      mescrollDown: {
        callback: this.downCallback,
        page: {
          num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        textInOffset: '下拉加载', // 下拉初始文案
        textOutOffset: '释放下拉加载', // 下拉刷新完成文案
        textLoading: '下拉加载中...'// 下拉加载中文案
      }
    };
  },
  created() {
  },
  mounted() {
    this.init()
  },
  beforeRouteEnter(to, from, next) {
    to.meta.title = to.query.name;
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  destroyed() {
    if (Vue.prototype.$preview.self) {
      Vue.prototype.$preview.self.close();
    }
    send("leave", { room_uuid: this.currentRoomUuid });
  },
  activated() {
    window.physicsBackRouter = "/home";
  },
  methods: {
    ...mapMutations({
      updateMsgList: "updateMsgList"
    }),
    init(){
      this.updateMsgList([]);
      try {
        // 扩展API加载完毕后调用onPlusReady回调函数
        document.addEventListener("plusready", onPlusReady(), false);
        // 扩展API加载完毕，现在可以正常调用扩展API
        function onPlusReady() {
          window.r = plus.audio.getRecorder();
        }
      } catch (e) {
        //console.log('不是app内')
      }
      this.mescrollDom = document.getElementsByClassName('mescroll')[0]
      this.handleHeightToBottom(this.htmlFontSize*3)
      new Swiper(".swiper-cont", {
        loop: false,
        autoplay: false, //可选选项，自动滑动
        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        observer: true,
        observeParents: true
      });
      window.onresize = () =>{
        setTimeout(() => {
          this.handleHeightToBottom(this.htmlFontSize*3)
          this.handleSendShow();
        }, 300);
      }; 
    },
    handleHeightToBottom(value){
      this.mescrollDom.style.height = document.body.clientHeight - value + "px";
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    downCallback(mescroll) {
      if(this.mescrollDown.page.num>1){
        this.lockDown = true;
      }
      if(this.currentRoomSaveAction == 0){
        getRoomMsg(
          this.currentRoomUuid,
          this.mescrollDown.page.num,
          this.mescrollDown.page.size
        ).then(res => {
          let msgList = JSON.parse(JSON.stringify(this.msgList))
          msgList = res.list.concat(msgList)
          this.updateMsgList(msgList);
          this.$nextTick(() => {
            if((msgList.length> 10 && msgList.length == res.total) || this.mescrollDown.page.num>3){
              this.moreInfoShow = true
              mescroll.lockDownScroll(true)
            }
            mescroll.endSuccess()// 结束下拉刷新,无参
            this.$previewRefresh();
            this.mescrollDown.page.num++
          });
        });
      }else if(this.currentRoomSaveAction == 1){
        roomMsgGet(
          {room_uuid:this.currentRoomUuid,
          page_no:this.mescrollDown.page.num,
          per_page:this.mescrollDown.page.size}
        ).then(res => {
          let msgList = JSON.parse(JSON.stringify(this.msgList))
          msgList = res.data.list.reverse().concat(msgList)
          this.updateMsgList(msgList);
          this.$nextTick(() => {
            if((msgList.length> 10 && msgList.length == res.data.page.count) || this.mescrollDown.page.num>3){
              this.moreInfoShow = true
              mescroll.lockDownScroll(true)
            }
            mescroll.endSuccess()// 结束下拉刷新,无参
            this.$previewRefresh();
            this.mescrollDown.page.num++
          });
        });
      }
    },
    handleFileOnChange(event) {
      let file = event.target.files[0];
      let data = new FormData(); 
      data.append("file", file);
      uploadFile(data).then(res => {
        let file_path = process.env.VUE_APP_CLIENT_API + res.data.path;
        let file = `<a onclick="downLoad('${file_path}','${res.data.name}')">${res.data.name}</a>`;
        chatSend({
          data: {
            msg: file,
            room_uuid: this.currentRoomUuid,
            type: 1,
            save_action:this.currentRoomSaveAction
          }
        });
      });
    },
    handleImgOnChange(event) {
      let that = this;
      let file = event.target.files[0];
      if (file.type.indexOf("image/") == -1) {
        Alert({ mes: "请上传图片!" });
        return;
      }
      //创建读取文件的对象
      let reader = new FileReader();
      //为文件读取成功设置事件
      reader.onload = function(e) {
        that.reqImgData.imgDatas = e.target.result;
        that.cropperShow = true;
      };
      //正式读取文件
      reader.readAsDataURL(file);
    },
    // 扩展API加载完毕，现在可以正常调用扩展API
    getCurrentPosition() {
      plus.geolocation.getCurrentPosition(
        function(p) {
          chatSend({
            data: {
              msg: p.addresses,
              room_uuid: this.currentRoomUuid,
              type: 1,
              save_action:this.currentRoomSaveAction
            }
          });
        },
        function(e) {
          switch (e.code) {
            case e.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.");
              break;
            case e.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case e.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            case e.UNKNOWN_ERROR:
              alert("An unknown error occurred.");
              break;
          }
        }
      );
    },
    sendMsg() {
      this.created_at = parseInt(new Date().getTime() / 1000);
      chatSend({
        data: {
          msg: this.content,
          room_uuid: this.currentRoomUuid,
          type: 1, //1是文字，0是语音, 2是重发
          save_action: this.currentRoomSaveAction
        }
      });
      document.getElementById("edit").innerHTML = "";
      this.content = "";
      this.closeDefIconsShow();
    },
    reSendMsg(created_at) {
      reChatSend({
        data: {
          room_uuid: this.currentRoomUuid,
          type: 2, //1是文字，0是语音, 2是重发
          created_at: created_at,
          save_action: this.currentRoomSaveAction
        }
      });
    },
    handleContent(value){
      this.content = value
    },
    handleRecordShow(value) {
      if(value== ''){
        this.recordShow = !this.recordShow;
      }else{
        this.recordShow = value
      }
    },
    closeDefIconsShow() {
      this.iconsShow = false;this.defsShow = false;this.recordShow = false;
      this.handleHeightToBottom(this.htmlFontSize*3)
    },
    handleSendShow() {
      if (this.content.length >= 1) {
        this.sendShow = true;
      } else {
        this.sendShow = false;
      }
    },
    /* 回滚到底部并重置预览图片 */
    handleMsgListToBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          if(!this.lockDown){
            this.mescrollDom.scrollTop = document.getElementsByClassName('mscroll-container')[0].scrollHeight;
          }
          this.$previewRefresh();
          this.lockDown = false;
        }, 100);
      });
    },
    handleDefsShow() {
      if (this.defsShow) {
        this.handleHeightToBottom(this.htmlFontSize*3)
      } else {
        this.handleHeightToBottom(this.htmlFontSize*7.5)
      }
      this.defsShow = !this.defsShow;this.iconsShow = false;this.recordShow = false;
      this.handleSendShow();
      if (this.iconsShow == false && this.defsShow == false) {
        this.handleHeightToBottom(this.htmlFontSize*3)
      }
      this.handleMsgListToBottom()
    },
    handleIconsShow() {
      this.iconsShow?this.handleHeightToBottom(this.htmlFontSize*3):this.handleHeightToBottom(this.htmlFontSize*7.5)
      this.iconsShow = !this.iconsShow;
      this.defsShow = false;
      this.recordShow = false;
      this.handleSendShow();
      if (this.iconsShow == false && this.defsShow == false) this.handleHeightToBottom(this.htmlFontSize*3)
      
      this.handleMsgListToBottom()
    },
    insertIcon(src) {
      this.content = `${this.content}<img src="${src}">`
    },
    amrPlay(url, index) {
      let that = this;
      Vue.set(this.data[index].data, "status", true);
      var BenzAMRRecorder = require("benz-amr-recorder");
      var amr = new BenzAMRRecorder();
      amr.initWithUrl(url).then(function() {
        amr.play();
      });
      amr.onEnded(function() {
        Vue.set(that.data[index].data, "status", false);
      });
    },
    recReqImgData(value){
      this.reqImgData.imgDatas = value;
    },
    recCropperShow(value){
      this.cropperShow = value;
    }
  },
  watch: {
    //监听聊天数据变动
    content: "handleSendShow",
    data: "handleSendShow",
    msgList: "handleMsgListToBottom"
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
@import "./scss/room";
</style>