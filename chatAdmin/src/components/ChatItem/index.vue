<!--
 * @Author: hua
 * @Date: 2019-11-21 10:18:03
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-08-16 12:56:51
 -->
<template>
  <div>
    <ul style="height:250px;overflow:auto" id="chat_containor">
      <li v-for="(key, index) in msgList" :key="index">
        <div class="chat-item" v-if="(key.user_id == user_id)&& (key.user_type==0)">
          <div class="mychat">
            <img :src="key.head_img" class="img" />
            <div class="nt">
              <span v-html="key.name"></span>
            </div>
            <div
              v-if="key.type == RECORD"
              class="msg"
              @mousedown="amrPlay(JSON.parse(key.msg), index)"
            >
              <img
                class="vioce_start"
                style="margin-right:-3px"
                src="static/img/voice_left.gif"
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
            <div v-else class="msg" v-html="key.msg"></div>
          </div>
        </div>
        <div class="chat-item" v-else>
          <div class="otherchat">
            <img class="img" :src="key.head_img" />
            <div class="nt">
              <span v-html="key.name"></span>
            </div>
            <div
              v-if="key.type == RECORD"
              class="msg"
              @mousedown="amrPlay(JSON.parse(key.msg), index)"
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
            <div v-else class="msg" v-html="key.msg"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    msgList: {
      type: Array,
      default: () => []
    },
    user_id: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters([
      "htmlFontSize",
      "currentRoomSaveAction",
      "RECORD",
      "TEXT",
      "RESEND",
      "IMG",
      "FILE",
      "LOADING",
      "SUCCESS",
      "FAIL"
    ])
  },
  watch: {
    msgList: {
      handler() {
        this.$nextTick(() => {
          setTimeout(() => {
            var ele = document.getElementById("chat_containor");
            console.log(ele.scrollHeight);
            ele.scrollTop = ele.scrollHeight;
          });
        }, 100);
      }
    }
  },
  methods: {
    amrPlay(rawData, index) {
      let that = this;
      let data = JSON.parse(JSON.stringify(rawData));
      let msgList = JSON.parse(JSON.stringify(this.msgList));
      console.log(data.url);
      data["status"] = true;
      msgList[index]["msg"] = JSON.stringify(data);
      this.$store.dispatch("updateMsgList", msgList);
      var BenzAMRRecorder = require("benz-amr-recorder");
      var amr = new BenzAMRRecorder();
      amr
        .initWithUrl(data.url)
        .then(function() {
          amr.play();
        })
        .catch(e => {
          console.log("313131", e);
        });
      amr.onEnded(() => {
        let data = JSON.parse(JSON.stringify(rawData));
        let msgList = JSON.parse(JSON.stringify(this.msgList));
        data["status"] = false;
        msgList[index]["msg"] = JSON.stringify(data);
        this.$store.dispatch("updateMsgList", msgList);
      });
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
  created: function() {}
};
</script>

<style lang="scss" scoped>
/* 聊天 */
ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 400px;
}
li {
  display: list-item;
  text-align: -webkit-match-parent;
  padding: 0;
  margin-top: 20px;
}
ul li {
  list-style: none;
}
.chat-item {
  width: 100%;
  margin: 14px 0;
  height: 0px;
}
.chat-item .otherchat {
  width: 100%;
  position: relative;
}
.chat-item .otherchat .img {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 4px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer;
}
.chat-item .otherchat .nt {
  font-size: 12px;
  left: 50px;
  top: -26px;
  position: absolute;
  color: #686868;
}
.chat-item .otherchat .nt span {
  padding-right: 0.3rem;
}
.chat-item .otherchat .nt span:nth-child(2) {
  font-size: 12px;
}
.chat-item .otherchat .msg {
  float: left;
  min-height: 21px;
  max-width: 60% !important;
  margin-left: 50px;
  padding: 6px;
  border-radius: 8px;
  font-size: 14px;
  /* line-height: 2.34rem; */
  background-color: #fff;
}
.chat-item .otherchat .rawMsg {
  float: left;
  min-height: 21px;
  max-width: 60% !important;
  margin-left: 45px;
  padding: 6px;
  border-radius: 8px;
  font-size: 14px;
  /* line-height: 2.34rem; */
  background-color: #fff;
  position: relative;
  top: 5px;
  word-wrap: break-word;
}
.otherchat .rawMsg::before {
  content: "";
  width: 0;
  height: 0;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
  border-width: 10px;
  border-style: solid dashed dashed dashed;
  border-color: transparent transparent #fff transparent;
  position: absolute;
  top: -15px;
  left: 0px;
}
/* my */
.chat-item .mychat {
  width: 100%;
  position: relative;
}
.chat-item .mychat .img {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  right: 4px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.chat-item .mychat .nt {
  font-size: 12px;
  right: 50px;
  top: -26px;
  position: absolute;
  color: #686868;
}
.chat-item .mychat .msg {
  float: right;
  max-width: 60%;
  margin-right: 50px;
  padding: 6px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #b2e281;
  color: #fff;
  word-wrap: break-word;
}
.chat-item .mychat .rawMsg {
  float: right;
  max-width: 60%;
  margin-right: 50px;
  padding: 6px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #b2e281;
  color: #fff;
  word-wrap: break-word;
  position: relative;
  top: 5px;
}
.mychat .rawMsg::before {
  content: "";
  width: 0;
  height: 0;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
  border-width: 10px;
  border-style: solid dashed dashed dashed;
  border-color: transparent transparent #b2e281 transparent;
  position: absolute;
  top: -15px;
  right: 0px;
}
/* 声音 */
.Rotate {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  /* IE 9 */
  -moz-transform: rotate(180deg);
  /* Firefox */
  -webkit-transform: rotate(180deg);
  /* Safari 和 Chrome */
  -o-transform: rotate(180deg);
  /* Opera */
}
.vioce_second {
  vertical-align: top;
  line-height: 23px;
  display: inline-block;
  padding-left: 0px;
}
.chat_right {
  height: 23px;
  width: 23px;
}
.vioce_start {
  height: 23px;
  width: 23px;
  vertical-align: top;
}
.vioce_stop_right {
  background: url("../../assets/img/spriteImg.png") no-repeat;
  background-position: -200px -433px;
  -webkit-background-size: 487px 462px;
  background-size: 487px 462px;
  display: inline-block;
  vertical-align: middle;
  width: 23px;
  height: 23px;
  margin-right: 4px;
}

.vioce_stop_left {
  background: url("../../assets/img/spriteImg.png") no-repeat;
  background-position: -465px -398px;
  -webkit-background-size: 487px 462px;
  background-size: 487px 462px;
  display: inline-block;
  vertical-align: middle;
  width: 23px;
  height: 23px;
  margin-left: 1px;
}

/* .vue-cropper-box {
    width: 100%;
    height: 100%;
}

.vue-cropper-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
}
 */
.yd-grids-raw {
  overflow: hidden;
  position: relative;
  background-color: #fff;
}

.yd-grids-raw .yd-grids-item {
  width: 25%;
}

.yd-grids-item-raw {
  width: 25%;
  float: left;
  position: relative;
  z-index: 0;
  padding: 0.35rem 0;
  font-size: 0.28rem;
}

.yd-grids-icon {
  height: 0.68rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.yd-grids-txt {
  word-wrap: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  color: #333;
  padding: 0 0.2rem;
}
.send_status {
  float: right;
  max-width: 60%;
  border-radius: 8px;
  font-size: 14px;
  word-wrap: break-word;
  position: relative;
  top: 5px;
  margin-right: 5px;
}
.rotate_loading {
  -webkit-animation: rotate 0.8s linear infinite;
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(270deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
