<!--
 * @Author: hua
 * @Date: 2019-02-26 09:08:43
 * @LastEditors: hua
 * @LastEditTime: 2019-07-19 10:38:42
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
                  <vImg
                    class="vioce_start"
                    style="margin-right:-3px"
                    :imgUrl="'static/img/voice_left.gif'"
                    v-show="key.status"
                  />
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
      </div>
    </mescroll-vue>
    <!-- 语音输入gif图 -->
    <vImg
      v-show="recordingShow"
      class="recording"
      :imgUrl="'static/img/recording.gif'"
    />
    <!-- 输入 -->
    <div class="input_wrapper" :style="iconsShow || defsShow ?'bottom:200px':'bottom:0.2rem'">
      <div class="voice" @click="handleRecordShow">
        <yd-icon slot="icon" name="uniE906" custom></yd-icon>
      </div>
      <!-- 语音输入 -->
      <div
        :class="touched? 'record touched':'record'"
        v-show="recordShow"
        @touchstart="startRecord"
        @touchend="stopRecord"
      >
        按住
        说话
      </div>
      <!-- 输入栏 -->
      <vEditDiv
        v-show="!recordShow"
        @click.native="closeDefIconsShow"
        class="input"
        id="edit"
        placeholder="请输入文字"
        v-model="content"
      ></vEditDiv>
      <div class="def" @click="handleIconsShow">
        <yd-icon slot="icon" name="uniE905" custom></yd-icon>
      </div>
      <div class="def" style="padding-left:0px;" @click="handleDefsShow" v-show="!sendShow">
        <yd-icon slot="icon" name="jia2" custom></yd-icon>
      </div>
      <div class="def" style="padding-left:0px;" v-show="sendShow">
        <yd-button
          @click.native="sendMsg()"
          type="disabled"
          size="small"
          bgcolor="#00C2E6"
          color="#fff"
        >发送</yd-button>
      </div>
      <!-- 隐藏的输入框 -->
      <input
        name="img"
        style="display:none;"
        id="img"
        type="file"
        accept="image/*"
        @change="handleOnChange($event)"
      />
      <input
        name="file"
        style="display:none;"
        id="file"
        type="file"
        @change="handleFileOnChange($event)"
      />
    </div>
    <!-- 表情 -->
    <icons @recInsertIcon="insertIcon" v-show="iconsShow"/>
    <!-- 功能栏 -->
    <def v-show="defsShow"/>
    <!-- 裁剪图 -->
    <cropperBox v-if="cropperShow" :reqImgData="reqImgData" @recReqImgData="recReqImgData"  @recCropperShow="recCropperShow"/>   
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import vEditDiv from "@/components/v-edit-div/v-edit-div";
import vImg from '@/components/v-img/v-img'
import icons from './components/icons/icons'
import def from './components/def/def'
import cropperBox from './components/cropperBox/cropperBox'
import MescrollVue from "mescroll.js/mescroll.vue"
import { uploadFile } from "@/api/common";
import utils from "@/utils/utils";
import storage from "@/utils/localstorage";
import { getRoomMsg } from "@/utils/indexedDB";
import {Confirm,Alert,Toast,Notify,Loading} from "vue-ydui/dist/lib.rem/dialog";
import { send } from "@/utils/socketio";
import { chatSend, reChatSend } from "@/socketIoApi/chat";
export default {
  components: {
    MescrollVue, vEditDiv,vImg, icons, def, cropperBox
  },
  computed: {
    ...mapGetters(["msgList", "currentRoomUuid", "currentRoomName", "userInfo", "htmlFontSize"])
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
  },
  mounted() {
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
    handleHeightToBottom(value){
      this.mescrollDom.style.height = document.body.clientHeight - value + "px";
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    downCallback(mescroll) {
      this.lockDown = true;
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
            type: 1
          }
        });
      });
    },
    handleOnChange(event) {
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
              type: 1
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
          type: 1 //1是文字，0是语音, 2是重发
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
          created_at: created_at
        }
      });
    },
    handleRecordShow() {
      this.recordShow = !this.recordShow;
    },
    closeDefIconsShow() {
      this.iconsShow = false;
      this.defsShow = false;
      this.recordShow = false;
      this.handleHeightToBottom(this.htmlFontSize*3)
    },
    handleSendShow() {
      if (this.content.length >= 1) {
        this.sendShow = true;
      } else {
        this.sendShow = false;
      }
    },
    handleMsgListToBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$previewRefresh();
          if(!this.lockDown){
            let ele = document.getElementsByClassName('mscroll-container')[0]
            this.mescrollDom.scrollTop = ele.scrollHeight;
          }
          this.lockDown = false;
        }, 200);
      });
    },
    handleDefsShow() {
      if (this.defsShow) {
        this.handleHeightToBottom(this.htmlFontSize*3)
      } else {
        this.handleHeightToBottom(this.htmlFontSize*9)
      }
      this.defsShow = !this.defsShow;
      this.iconsShow = false;
      this.recordShow = false;
      this.handleSendShow();
      if (this.iconsShow == false && this.defsShow == false) {
        this.handleHeightToBottom(this.htmlFontSize*3)
      }
      this.handleMsgListToBottom()
    },
    handleIconsShow() {
      if (this.iconsShow) {
        this.handleHeightToBottom(this.htmlFontSize*3)
      } else {
        this.handleHeightToBottom(this.htmlFontSize*9)
      }
      this.iconsShow = !this.iconsShow;
      this.defsShow = false;
      this.recordShow = false;
      this.handleSendShow();
      if (this.iconsShow == false && this.defsShow == false) {
        this.handleHeightToBottom(this.htmlFontSize*3)
      }
      this.handleMsgListToBottom()
    },
    insertIcon(src) {
      this.content = `${this.content}<img src="${src}">`
    },
    // 录音开始
    startRecord() {
      //to do
    },
    // 录音结束
    stopRecord() {
      this.touched = false;
      if (window.plus) {
        window.r.stop();
      }
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