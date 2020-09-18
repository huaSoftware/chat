<!--
 * @Author: hua
 * @Date: 2019-02-26 09:08:43
 * @description: 聊天室核心页面
 * @LastEditors: hua
 * @LastEditTime: 2020-05-04 11:36:18
 -->
<template>
  <div style="font-size: 0;" id="msg_empty">
    <!-- 内容 -->
    <mescroll-vue :down="mescrollDown" @init="mescrollInit" @touchstart="closeDefIconsShow()">
      <div class="mscroll-container">
        <div v-show="moreInfoShow" class="more_info" @click="$router.push({name: 'roomMsgList'})">
          更多消息，请
          <span class="primary_color">打开消息记录</span>
        </div>
        <ul>
          <li v-for="(key, index) in msgList" :key="index">
            <div
              class="format_time"
              v-if="index>0 && key.created_at> parseInt(msgList[index-1].created_at)+60"
            >{{formatTime(key.created_at)}}</div>
            <div class="chat-item" v-if="(key.user_id == userInfo.id) && (key.user_type==0)">
              <div class="mychat">
                <vImg :imgUrl="key.head_img" class="img" />
                <div class="nt">
                  <span v-html="key.name"></span>
                </div>
                <div
                  v-if="key.type == RECORD"
                  class="msg"
                  @touchstart="amrPlay(JSON.parse(key.msg), index)"
                >
                  <img
                    class="vioce_start"
                    style="margin-right:-3px"
                    :src="'static/img/voice_left.gif'"
                    v-show="JSON.parse(key.msg)['status']"
                  />
                  <i class="vioce_stop_left" v-show="!JSON.parse(key.msg)['status']"></i>
                  <span class="vioce_second">{{JSON.parse(key.msg)['duration']}}s</span>
                </div>
                <div v-else-if="key.type == TEXT" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div v-else-if="key.type == IMG" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div
                  v-else-if="key.type == FILE"
                  class="rawMsg"
                  @click="handleDefMsg(key.msg)"
                >[文件]{{formatFileName(key.msg)}}</div>
                <div
                  v-else-if="key.type == CHAT_NOTIFY"
                  class="rawMsg"
                >{{JSON.parse(key.msg)['msg']}}</div>
                <div v-else class="msg" v-html="key.msg"></div>
                <!-- 消息送达状态 -->
                <span
                  v-if="key.send_status == LOADING "
                  class="send_status loading_color rotate_loading"
                >
                  <yd-icon name="refresh"></yd-icon>
                </span>
                <span
                  @click="reSendMsg(key)"
                  v-if="key.send_status == FAIL"
                  class="send_status color_danger"
                >
                  <yd-icon name="error"></yd-icon>
                </span>
                <!-- 消息读取状态键盘输入时更新-->
                <span class="read_status" v-if="key.send_status == SUCCESS && currentRoomType == 0">
                  <yd-badge v-if="key.read_status == 0">未读</yd-badge>
                  <yd-badge v-else type="primary">已读</yd-badge>
                </span>
              </div>
            </div>
            <div class="chat-item" v-else>
              <div class="otherchat">
                <vImg class="img" :imgUrl="key.head_img" />
                <div class="nt">
                  <span v-html="key.name"></span>
                </div>
                <div
                  v-if="key.type == RECORD"
                  class="msg"
                  @touchstart="amrPlay(JSON.parse(key.msg), index)"
                >
                  <img
                    class="chat_right vioce_start"
                    :src="'static/img/voice_right.gif'"
                    v-show="JSON.parse(key.msg)['status']"
                  />
                  <i class="vioce_stop_right" v-show="!JSON.parse(key.msg)['status']"></i>
                  <span class="vioce_second">{{JSON.parse(key.msg)['duration']}}s</span>
                </div>
                <div v-else-if="key.type == TEXT" class="rawMsg" v-html="key.msg"></div>
                <div v-else-if="key.type == IMG" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                <div
                  v-else-if="key.type == FILE"
                  class="rawMsg"
                  @click="handleDefMsg(key.msg)"
                >[文件]{{formatFileName(key.msg)}}</div>
                <div v-else-if="key.type == CHAT_NOTIFY" class="rawMsg">{{key.msg}}</div>
                <div v-else class="msg" v-html="key.msg"></div>
              </div>
            </div>
          </li>
        </ul>
        <!-- 暂无消息 -->
        <vEmpty v-if="msgList.length==0 && isEmpty"></vEmpty>
      </div>
    </mescroll-vue>
    <!-- 语音输入gif图 -->
    <img v-show="recordingShow" class="recording" :src="'static/img/recording.png'" />
    <!-- 输入 -->
    <inputWrapper
      :style="iconsShow || defsShow ?'bottom:200px':'bottom:0rem'"
      @handleRecordShow="handleRecordShow"
      @closeDefIconsShow="closeDefIconsShow"
      @handleIconsShow="handleIconsShow"
      @handleDefsShow="handleDefsShow"
      @sendMsg="sendMsg"
      @handleImgOnChange="handleImgOnChange"
      @handleFileOnChange="handleFileOnChange"
      @handleContent="handleContent"
      @handleStartRecord="handleStartRecord"
      @onFocus="handleOnFocus"
      @onBlur="handleOnblur"
      :recordShow="recordShow"
      :content="content"
      :touched="touched"
      :sendShow="sendShow"
    ></inputWrapper>
    <!-- 表情 -->
    <icons @recInsertIcon="insertIcon" v-if="iconsShow" />
    <!-- 功能栏 -->
    <def v-show="defsShow" />
    <!-- 裁剪图 -->
    <cropperBox
      v-if="cropperShow"
      :reqImgData="reqImgData"
      @recReqImgData="recReqImgData"
      @recCropperShow="recCropperShow"
    />
    <!-- 选择人 -->
    <div class="address-book-list" v-if="addressBookShow">
      <dl v-for="num in 26" :key="num">
        <dt :ref="String.fromCharCode(64+num)">{{String.fromCharCode(64+num)}}</dt>
        <dd
          v-for="(item, index) in adderssBookList"
          :key="index"
          v-if="String.fromCharCode(64+num) == item.users.first_word"
          @click="handleChooseUser(item.users)"
        >
          <!-- 循环 -->
          <a>
            <vImg :imgUrl="item.users.head_img" />
            {{item.users.nick_name}}
          </a>
        </dd>
      </dl>
      <dl>
        <dt ref="#">#</dt>
        <dd
          v-for="(item, index) in adderssBookList"
          :key="index"
          v-if="item.users.first_word == '#'"
          @click="handleChooseUser(item.users)"
        >
          <!-- 循环 -->
          <a>
            <vImg :imgUrl="item.users.head_img" />
            {{item.users.nick_name}}
          </a>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
/* 重新设计输入栏 */
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import vImg from "@/components/v-img/v-img";
import vEmpty from "@/components/v-empty/v-empty";
import inputWrapper from "./components/input-wrapper/input-wrapper";
import icons from "./components/icons/icons";
import def from "./components/def/def";
import cropperBox from "./components/cropperBox/cropperBox";
import MescrollVue from "mescroll.js/mescroll.vue";
import { uploadFile } from "@/socketioApi/common";
import utils from "@/utils/utils";
import { recOpen, recStart, recStop } from "@/utils/recorder";
import storage from "@/utils/localstorage";
import { getLocalRoomMsg } from "@/utils/indexedDB";
import { getCloudRoomMsg } from "@/socketioApi/room";
import {
  Confirm,
  Alert,
  Toast,
  Notify,
  Loading
} from "vue-ydui/dist/lib.rem/dialog";
import { send } from "@/utils/socketio";
import { addressBookGet } from "@/socketioApi/addressBook";
import { chatSend, reChatSend } from "@/socketioApi/chat";
import axios from "axios";
import lrz from "lrz";
export default {
  components: {
    MescrollVue,
    vImg,
    icons,
    def,
    cropperBox,
    vEmpty,
    inputWrapper
  },
  computed: {
    ...mapGetters([
      "msgList",
      "currentRoomUuid",
      "currentRoomName",
      "currentRoomType",
      "userInfo",
      "htmlFontSize",
      "currentRoomSaveAction",
      "RECORD",
      "TEXT",
      "RESEND",
      "IMG",
      "FILE",
      "LOADING",
      "SUCCESS",
      "FAIL",
      "CHAT_NOTIFY"
    ])
  },
  data() {
    return {
      uuidVal: "",
      scroll: "",
      content: "",
      isEmpty: true,
      isPartChatPage: false,
      iconsShow: false,
      defsShow: false,
      sendShow: false,
      recordShow: false,
      recordingShow: false,
      touched: false,
      cropperShow: false,
      lockDown: false,
      moreInfoShow: false,
      onFocusLock: false,
      addressBookShow: false,
      clientHeight: 0,
      data: [],
      adderssBookList: [],
      reqImgData: {
        url: process.env.VUE_APP_CLIENT_SOCKET,
        imgDatas: ""
      },
      reqData: {
        page_no: 1,
        per_page: 10000000
      },
      mescroll: null, // mescroll实例对象
      mescrollDom: null,
      mescrollDown: {
        callback: this.downCallback,
        page: {
          num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        textInOffset: "下拉加载", // 下拉初始文案
        textOutOffset: "释放下拉加载", // 下拉刷新完成文案
        textLoading: "下拉加载中..." // 下拉加载中文案
      }
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeRouteEnter(to, from, next) {
    to.meta.title = to.query.name;
    next(vm => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
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
    init() {
      this.clientHeight = document.body.clientHeight;
      this.mescrollDom = document.getElementsByClassName("mescroll")[0];
      this.isPartChatPage = false;
      if (window.plus) {
        window.r = plus.audio.getRecorder();
      }
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
      this.updateMsgList([]);
      this.handleHeightToBottom();
      window.onresize = () => {
        this.isEmpty = false;
        if (document.body.clientHeight < this.clientHeight) {
          /* if(this.iconsShow ==true || this.defsShow ==true){
            setTimeout(() => {
              this.isPartChatPage = 'keyborad'
              this.handleHeightToBottom()
              this.handleSendShow();
            }, 50);
          }else{ */
          this.isPartChatPage = "keyborad";
          this.handleHeightToBottom();
          this.handleSendShow();
          //}
        } else {
          if (this.iconsShow !== true && this.defsShow !== true) {
            this.isPartChatPage = false;
          }
          this.handleHeightToBottom();
          this.handleSendShow();
        }
      };
    },
    handleOnFocus() {
      if (!this.onFocusLock) {
        this.onFocusLock = true;
        send(
          "input",
          { room_uuid: this.currentRoomUuid, even: "focus" },
          "broadcast"
        );
      }
    },
    handleOnblur() {
      this.onFocusLock = false;
      send(
        "input",
        { room_uuid: this.currentRoomUuid, even: "blur" },
        "broadcast"
      );
    },
    handleHeightToBottom() {
      if (this.isPartChatPage == false) {
        this.mescrollDom.style.height =
          document.body.clientHeight - this.htmlFontSize * 2 + "px";
      } else if (this.isPartChatPage == "keyborad") {
        this.mescrollDom.style.height =
          document.body.clientHeight - this.htmlFontSize * 2 + "px";
      } else {
        this.mescrollDom.style.height =
          document.body.clientHeight - this.htmlFontSize * 2 - 200 + "px";
      }
      this.handleMsgListToBottom(100);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    downCallback(mescroll) {
      if (this.mescrollDown.page.num > 1) {
        this.lockDown = true;
      }
      if (this.currentRoomSaveAction == 0) {
        getLocalRoomMsg(
          this.currentRoomUuid,
          this.mescrollDown.page.num,
          this.mescrollDown.page.size
        ).then(res => {
          let msgList = JSON.parse(JSON.stringify(this.msgList));
          msgList = res.list.concat(msgList);
          this.updateMsgList(msgList);
          this.$nextTick(() => {
            if (
              (msgList.length > 10 && msgList.length == res.total) ||
              this.mescrollDown.page.num > 3
            ) {
              this.moreInfoShow = true;
              mescroll.lockDownScroll(true);
            }
            mescroll.endSuccess(); // 结束下拉刷新,无参
            this.$previewRefresh();
            this.mescrollDown.page.num++;
          });
        });
      } else if (this.currentRoomSaveAction == 1) {
        getCloudRoomMsg({
          room_uuid: this.currentRoomUuid,
          page_no: this.mescrollDown.page.num,
          per_page: this.mescrollDown.page.size
        }).then(res => {
          let msgList = JSON.parse(JSON.stringify(this.msgList));
          let rawList = res.data.list;
          rawList.map(item => {
            item["msg"] = item["formatMsg"];
            delete item["formatMsg"];
            return item;
          });
          msgList = rawList.reverse().concat(msgList);
          this.updateMsgList(msgList);
          this.$nextTick(() => {
            if (
              (msgList.length > 10 && msgList.length == res.data.page.count) ||
              this.mescrollDown.page.num > 3
            ) {
              this.moreInfoShow = true;
              mescroll.lockDownScroll(true);
            }
            mescroll.endSuccess(); // 结束下拉刷新,无参
            this.$previewRefresh();
            this.mescrollDown.page.num++;
          });
        });
      }
    },
    handleFileOnChange(event) {
      let file = event.target.files[0];
      if (!!file) {
        //读取本地文件，以gbk编码方式输出
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          Loading.open("上传中...");
          uploadFile({
            dataUrl: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          })
            .then(res => {
              let file_path = process.env.VUE_APP_CLIENT_SOCKET + res.data.path;
              let file = `<a href='${file_path}' download='${
                res.data.name.split(".")[0]
              }'>${res.data.name.split(".")[0]}[文件]</a>`;
              Loading.close();
              chatSend({
                data: {
                  msg: file,
                  room_uuid: this.currentRoomUuid,
                  type: this.FILE,
                  save_action: this.currentRoomSaveAction
                }
              });
            })
            .catch(e => {
              Loading.close();
            });
        };
      }
    },
    handleImgOnChange(event) {
      let file = event.target.files[0];
      if (file.type.indexOf("image/") == -1) {
        Alert({ mes: "请上传图片!" });
        return;
      }
      lrz(file, { width: 1080 })
        .then(rst => {
          // 处理成功会执行
          if (rst.filelen > 204800) {
            Alert({ mes: "上传图片不能大于2M" });
          } else {
            this.reqImgData.imgDatas = rst.base64;
            this.cropperShow = true;
          }
          console.log(rst);
        })
        .catch(function(err) {
          // 处理失败会执行
          Toast({
            mes: err,
            icon: "error",
            timeout: 1500
          });
        })
        .always(function() {
          // 不管是成功失败，都会执行
        });
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
              save_action: this.currentRoomSaveAction
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
    reSendMsg(key) {
      reChatSend({
        data: {
          room_uuid: this.currentRoomUuid,
          type: this.RESEND,
          created_at: key.created_at,
          user_id: key.user_id,
          msg: key.msg,
          save_action: this.currentRoomSaveAction
        }
      });
    },
    handleContent(value) {
      this.content = value;
    },
    handleRecordShow(value) {
      if (value == "") {
        this.recordShow = !this.recordShow;
      } else {
        this.recordShow = value;
      }
    },
    closeDefIconsShow() {
      this.iconsShow = false;
      this.defsShow = false;
      this.recordShow = false;
      this.isPartChatPage = false;
      this.handleHeightToBottom();
    },
    handleSendShow(newVal, oldVal) {
      if (this.content.length >= 1) {
        this.sendShow = true;
      } else {
        this.sendShow = false;
      }
      let char = newVal.charAt(newVal.length - 1);
      if (char == "@") {
        addressBookGet(this.reqData).then(res => {
          this.adderssBookList = res.data.addressBookList;
          this.addressBookShow = true;
        });
      }
    },
    handleChooseUser(user) {
      console.log(user);
      let msg = this.content + user.nick_name;
      this.addressBookShow = false;
      // TODO
      chatSend({
        data: {
          msg: JSON.stringify({
            msg: msg,
            user: user,
            selfUser: this.userInfo
          }),
          room_uuid: this.currentRoomUuid,
          type: this.CHAT_NOTIFY,
          save_action: this.currentRoomSaveAction
        }
      });
      this.content = "";
    },
    /* 回滚到底部并重置预览图片 */
    handleMsgListToBottom(delayTime) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.lockDown) {
            this.mescrollDom.scrollTop = document.getElementsByClassName(
              "mscroll-container"
            )[0].scrollHeight;
          }
          this.$previewRefresh();
          this.lockDown = false;
        }, delayTime);
      });
    },
    handleDefsShow() {
      //这边需要解决获取焦点后的再切换表情的bug
      document.getElementsByClassName("edit-div")[0].blur();
      if (this.defsShow) {
        this.isPartChatPage = false;
        this.handleHeightToBottom();
      } else {
        this.isPartChatPage = true;
        this.handleHeightToBottom();
      }
      this.defsShow = !this.defsShow;
      this.iconsShow = false;
      this.recordShow = false;
      this.handleSendShow();
      if (this.iconsShow == false && this.defsShow == false) {
        this.isPartChatPage = false;
        this.handleHeightToBottom();
      }
      this.handleMsgListToBottom(100);
    },
    handleIconsShow() {
      //这边需要解决获取焦点后的再切换表情的bug
      document.getElementsByClassName("edit-div")[0].blur();
      if (this.iconsShow) {
        this.isPartChatPage = false;
        this.handleHeightToBottom();
      } else {
        this.isPartChatPage = true;
        this.handleHeightToBottom();
      }
      this.iconsShow = !this.iconsShow;
      this.defsShow = false;
      this.recordShow = false;
      this.handleSendShow();
      if (this.iconsShow == false && this.defsShow == false) {
        this.isPartChatPage = false;
        this.handleHeightToBottom();
      }
      this.handleMsgListToBottom(100);
    },
    insertIcon(src) {
      this.content = `${this.content}<img src='${src}'>`;
    },
    handleStartRecord() {
      this.defsShow = false;
      this.iconsShow = false;
      this.recordingShow = true;
      this.touched = true;
      if (window.plus) {
        if (window.r == null) {
          this.recordingShow = false;
          this.touched = false;
          return;
        }
        window.r.stop();
        window.r.record(
          { filename: "_doc/audio/" },
          p => {
            console.log("录音完成:" + p);
            //上传
            this.Audio2dataURL(p);
          },
          e => {
            console.log("录音出错", e);
            this.recordingShow = false;
            this.touched = false;
          }
        );
      } else {
        //使用H5录音
        recOpen(function() {
          recStart();
        });
      }
    },
    recordStop() {
      let that = this;
      recStop(blob => {
        // name
        const filename =
          this.currentRoomUuid +
          this.userInfo.id +
          new Date().getTime() +
          ".amr";
        // blob转file
        var file = new File([blob], filename, {
          type: "amr",
          lastModified: Date.now()
        });
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          uploadFile({
            dataUrl: e.target.result,
            name: filename,
            size: file.size,
            type: "amr"
          }).then(res => {
            var BenzAMRRecorder = require("benz-amr-recorder");
            var amr = new BenzAMRRecorder();
            const url = process.env.VUE_APP_CLIENT_SOCKET + res.data.path;
            amr
              .initWithUrl(url)
              .then(() => {
                chatSend({
                  data: {
                    msg: JSON.stringify({
                      url: url,
                      duration: amr.getDuration(),
                      status: false
                    }),
                    room_uuid: that.currentRoomUuid,
                    type: that.RECORD,
                    save_action: that.currentRoomSaveAction
                  }
                });
                that.recordingShow = false;
                that.touched = false;
              })
              .catch(e => {
                console.log(e);
                that.recordingShow = false;
                that.touched = false;
              });
          });
        };
      });
    },
    /**
     * 录音语音文件转base64字符串
     * @param {Object} path
     */
    Audio2dataURL(path) {
      let that = this;
      plus.io.resolveLocalFileSystemURL(path, function(entry) {
        entry.file(
          function(file) {
            var reader = new plus.io.FileReader();
            reader.onloadend = function(e) {
              uploadFile({
                dataUrl: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
              }).then(res => {
                that.recordingShow = false;
                var BenzAMRRecorder = require("benz-amr-recorder");
                var amr = new BenzAMRRecorder();
                let url = process.env.VUE_APP_CLIENT_SOCKET + res.data.path;
                amr
                  .initWithUrl(url)
                  .then(function() {
                    chatSend({
                      data: {
                        msg: JSON.stringify({
                          url: url,
                          duration: amr.getDuration(),
                          status: false
                        }),
                        room_uuid: that.currentRoomUuid,
                        type: that.RECORD,
                        save_action: that.currentRoomSaveAction
                      }
                    });
                  })
                  .catch(e => {
                    console.log(e);
                  });
              });
            };
            reader.readAsDataURL(file);
          },
          function(e) {
            console.log("读写出现异常: " + e.message);
          }
        );
      });
    },
    amrPlay(rawData, index) {
      let that = this;
      let data = JSON.parse(JSON.stringify(rawData));
      let msgList = JSON.parse(JSON.stringify(this.msgList));
      data["status"] = true;
      msgList[index]["msg"] = JSON.stringify(data);
      this.$store.dispatch("updateMsgList", msgList);
      var BenzAMRRecorder = require("benz-amr-recorder");
      var amr = new BenzAMRRecorder();
      amr.initWithUrl(data.url).then(function() {
        amr.play();
      });
      amr.onEnded(() => {
        let data = JSON.parse(JSON.stringify(rawData));
        let msgList = JSON.parse(JSON.stringify(this.msgList));
        data["status"] = false;
        msgList[index]["msg"] = JSON.stringify(data);
        this.$store.dispatch("updateMsgList", msgList);
      });
    },
    recReqImgData(value) {
      this.reqImgData.imgDatas = value;
    },
    recCropperShow(value) {
      this.cropperShow = value;
    },
    formatTime(value) {
      return utils.time.formatDate(value, "yyyy-MM-dd hh:mm:ss");
    },
    formatFileName(msg) {
      try {
        if (msg) {
          var pat = /href='(.+?)'/;
          let url = pat.exec(msg)[1];
          return url.split("uploads/")[1];
        }
      } catch (e) {
        return "解析错误";
      }
    },
    handleDefMsg(msg) {
      if (msg.indexOf("download") != -1) {
        var pat = /href='(.+?)'/;
        let url = pat.exec(msg)[1];
        axios({
          method: "get",
          url: url,
          timeout: 3000,
          headers: {},
          responseType: "blob"
        })
          .then(res => {
            const blob = new Blob([res.data]); //处理文档流
            const fileName = url.split("uploads/")[1];
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          })
          .catch(res => {
            console.log(res);
          });
      }
    }
  },
  watch: {
    //监听聊天数据变动
    content: "handleSendShow",
    data: "handleSendShow",
    msgList: {
      handler() {
        this.handleMsgListToBottom(100);
      }
    },
    recordShow(newVal, oldVal) {
      if (!newVal) {
        if (window.plus) {
          window.r.stop();
        }
        this.recordStop();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
@import "./scss/room";
</style>