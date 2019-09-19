<!--
 * @Author: hua
 * @Date: 2019-02-26 09:08:43
 * @LastEditors: hua
 * @LastEditTime: 2019-09-19 13:25:35
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
                <div v-if="key.type == RECORD" class="msg" @touchstart="amrPlay(key.msg, index)">
                  <img class="vioce_start" style="margin-right:-3px" :src="'static/img/voice_left.gif'" v-show="key.msg.status"/>
                  <i class="vioce_stop_left" v-show="!key.msg.status"></i>
                  <span class="vioce_second">{{key.msg.duration}}s</span>
                </div>
                <div v-else-if="key.type == TEXT" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div v-else-if="key.type == IMG" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div v-else-if="key.type == FILE" class="rawMsg"  @click="handleDefMsg(key.msg)">[文件]{{formartFileName(key.msg)}}</div>
                <div v-else class="msg" v-html="key.msg"></div>
                <!-- 消息送达状态 -->
                <span v-if="key.send_status == LOADING " class="send_status loading_color rotate_loading">
                  <yd-icon name="refresh"></yd-icon>
                </span>
                <span
                  @click="reSendMsg(key.created_at)"
                  v-if="key.send_status == FAIL"
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
                <div v-if="key.type == RECORD" class="msg" @touchstart="amrPlay(key.msg, index)">
                  <img
                    class="chat_right vioce_start"
                    :src="'static/img/voice_right.gif'"
                    v-show="key.msg.status"
                  />
                  <i class="vioce_stop_right" v-show="!key.msg.status"></i>
                  <span class="vioce_second">{{key.msg.duration}}s</span>
                </div>
                <div v-else-if="key.type == TEXT" class="rawMsg" v-html="key.msg"></div>
                <div v-else-if="key.type == IMG" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div v-else-if="key.type == FILE" class="rawMsg" @click="handleDefMsg(key.msg)">[文件]{{formartFileName(key.msg)}}</div>
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
    <img v-show="recordingShow" class="recording" :src="'static/img/recording.png'"/>
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
      @handleStartRecord="handleStartRecord"
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
import { getLocalRoomMsg } from "@/utils/indexedDB";
import {getCloudRoomMsg} from '@/api/room'
import {Confirm,Alert,Toast,Notify,Loading} from "vue-ydui/dist/lib.rem/dialog";
import { send } from "@/utils/socketio";
import { chatSend, reChatSend } from "@/socketIoApi/chat";
import axios from 'axios'
export default {
  components: {
    MescrollVue, vImg, icons, def, cropperBox, vEmpty, inputWrapper
  },
  computed: {
    ...mapGetters(["msgList", "currentRoomUuid", "currentRoomName", "userInfo", "htmlFontSize", "currentRoomSaveAction","RECORD","TEXT","RESEND","IMG","FILE","LOADING","SUCCESS","FAIL"])
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
        getLocalRoomMsg(
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
        getCloudRoomMsg(
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
        let file = `<a href="${file_path}" download="${res.data.name.split('.')[0]}">${res.data.name.split('.')[0]}[文件]</a>`;
        chatSend({
          data: {
            msg: file,
            room_uuid: this.currentRoomUuid,
            type: this.FILE,
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
              type: this.TEXT,
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
      chatSend({
        data: {
          msg: this.content,
          room_uuid: this.currentRoomUuid,
          type: this.TEXT,
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
          type: this.RESEND, 
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
    handleStartRecord(){
      let that = this
      this.defsShow = false
      this.iconsShow = false
      this.recordingShow = true
      this.touched = true
      if ( typeof window.r == 'undefined' ) {
          this.recordingShow = false
          this.touched = false
          alert( "Device not ready!" );
          return; 
      } 
      window.r.record( {filename:"_doc/audio/"}, function (p) {
        console.log('录音完成:' + p)
        //上传
        var task = plus.uploader.createUpload(process.env.VUE_APP_CLIENT_API+'/v2/api/upload', {  
        method: "post"
        },function(t, status) {
        if(status == 200) { 
            let data = JSON.parse(t.responseText)
            console.log(data)
            that.recordingShow = false
            var BenzAMRRecorder = require('benz-amr-recorder');
            var amr = new BenzAMRRecorder();
            let url = process.env.VUE_APP_CLIENT_API+ data.data.path
            amr.initWithUrl(url).then(function() {
            //获取录音长度
            //amr.getDuration(); 
            chatSend({
              data: {
                msg:{url:url,duration: amr.getDuration(),status:false},
                room_uuid: that.currentRoomUuid,
                type: that.RECORD, 
                save_action: that.currentRoomSaveAction
            }});
            console.log('录音路径'+url)
          })
        }else{
            console.log(t.responseText)
            console.log("上传失败："+status);
        }
        })
        let fileName = p.replace("_doc/audio/", '')
        task.addFile(p, {"key":"file",
                "name": fileName});  
        task.start();  
      })
    },
    amrPlay(rawData, index) {
      let that = this;
      let data = JSON.parse(JSON.stringify(rawData))
      let msgList = JSON.parse(JSON.stringify(this.msgList))
       console.log(data)
      data['status']=true
      msgList[index]['msg'] = data
      this.$store.dispatch('updateMsgList', msgList)
      //Vue.set(this.data[index].data, "status", true);
      var BenzAMRRecorder = require("benz-amr-recorder");
      var amr = new BenzAMRRecorder();
      amr.initWithUrl(data.url).then(function() {
        amr.play();
      });
      amr.onEnded(()=> {
        let data = JSON.parse(JSON.stringify(rawData))
        let msgList = JSON.parse(JSON.stringify(this.msgList))
        data['status']=false
        msgList[index]['msg'] = data
        this.$store.dispatch('updateMsgList', msgList)
        //Vue.set(that.data[index].data, "status", false);
      });
    },
    recReqImgData(value){
      this.reqImgData.imgDatas = value;
    },
    recCropperShow(value){
      this.cropperShow = value;
    },
    formartFileName(msg){
      if(msg){
        var pat=/href="(.+?)"/;
        let url = pat.exec(msg)[1]
        return url.split('uploads/')[1]
      }
    },
    handleDefMsg(msg){
      if(msg.indexOf("download") != -1 ){
        var pat=/href="(.+?)"/;
        let url = pat.exec(msg)[1]
        axios({
          method: 'get',
          url: url,
          timeout: 3000,
          headers: {},
          responseType: 'blob'
        }).then(res => {
          const blob = new Blob([res.data]);//处理文档流
          const fileName = url.split('uploads/')[1];
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }).catch(res => {
          console.log(res)
        })
      }
    },
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