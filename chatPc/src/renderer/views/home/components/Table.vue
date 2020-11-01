<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:47
 * @description: 首页
 * @LastEditors: hua
 * @LastEditTime: 2020-11-01 19:46:56
 -->
<template>
  <div class="content">
    <!-- 头部开始 -->
   <!--  <header class="yd-navbar header">
      <div class="yd-navbar-item"></div>
      <div class="yd-navbar-center-box" style="height: 1rem;">
        <div class="yd-navbar-center">
          <span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;">消息</span>
        </div>
      </div>
      <div class="yd-navbar-item" @click="defShow=!defShow">
        <span class="icon-custom-jia2 navbar_icon"></span>
      </div>
    </header> -->
    <!-- 功能栏 -->
    <!-- <yd-actionsheet :items="defs" v-model="defShow" cancel="取消"></yd-actionsheet> -->
    <!-- 头部结束 -->
    <!-- 单聊 -->
    <!-- <article class="yd-list yd-list-theme4" style="padding-top:1rem">
      <a
        @click="handleJoinRoom(item)"
        href="javascript:;"
        class="yd-list-item"
        v-for=" (item, index) in roomList"
        :key="index"
      >
        <div class="yd-list-img">
          <vImg v-if="item.type ==1 && item.adminUsers" :imgUrl="item.adminUsers.avatar" />
          <vImg
            v-else
            :style="item.users.online == 1?'':'background: grey;opacity: 0.5'"
            :imgUrl="item.users.head_img"
          />
        </div>
        <div class="yd-list-mes">
          <div class="yd-list-title">
            <span class="title-left" v-if="item.type ==1&& item.adminUsers">{{item.adminUsers.nick_name}}</span>
            <span class="title-left" v-if="item.type ==0">{{item.users.nick_name}}</span>
            <span class="title-right">{{formatTime(item.room.updated_at)}}</span>
          </div>
          <div class="yd-list-other">
            <div>
              <span class="last_msg" v-html="formatLastMsg(item.room.last_msg)"></span>
            </div>
            <div v-if="alert && item.is_alert">
              <yd-badge v-if="item.unread_number" type="danger">{{item.unread_number}}</yd-badge>
            </div>
          </div>
        </div>
      </a>
    </article> -->
    <!-- 群聊 -->
   <!--  <article class="yd-list yd-list-theme4">
      <a
        @click="handleJoinGroupRoom(item)"
        href="javascript:;"
        class="yd-list-item"
        v-for=" (item, index) in groupRoomList"
        :key="index"
      >
        <div class="yd-list-img">
          <img src="@/assets/img/default.png" />
        </div>
        <div class="yd-list-mes">
          <div class="yd-list-title">
            <span class="title-left">{{item.room.name}}</span>
            <span class="title-right">{{formatTime(item.room.updated_at)}}</span>
          </div>
          <div class="yd-list-other">
            <div>
              <span class="demo-list-price" v-html="formatLastMsg(item.room.last_msg)"></span>
            </div>
            <div v-if="alert && item.is_alert">
              <yd-badge v-if="item.unread_number" type="danger">{{item.unread_number}}</yd-badge>
            </div>
          </div>
        </div>
      </a>
    </article> -->
    <!-- <vImg class="loading" :imgUrl="require('@/assets/loading-bars.svg')" v-if="loading" />-->
    <!-- 参数空时页面 -->
    <!-- <vEmpty v-if="roomList.length==0 && loading==false && groupRoomList.length==0"></vEmpty> -->
    <el-row style="height:100%">
      <el-col class="home-room-list-wrap" :span="8" style="height:100%;">
        <el-menu
          :default-active="String(activeIndex)"
        >
          <el-submenu
            v-for=" (item, index) in roomList"
            :key="index"
            :index="`${String(index)}`">
            <template slot="title">
              <div :class="activeIndex == index?'room-wrap-hover room_wrap':'room_wrap'" @click="handleJoinRoom(item,index)" >
                <div class="list-img">
                  <vImg v-if="item.type ==1 && item.adminUsers" :imgUrl="item.adminUsers.avatar" />
                  <vImg
                    v-else
                    :style="item.users.online == 1?'':'background: grey;opacity: 0.5'"
                    :imgUrl="item.users.head_img"
                  />
                </div>
                <div class="list-mes">
                  <div class="list-title">
                    <div class="title-left" v-if="item.type ==1&& item.adminUsers">{{item.adminUsers.nick_name}}</div>
                    <div class="title-left" v-if="item.type ==0">{{item.users.nick_name}}</div>
                    <div class="title-right">{{formatTime(item.room.updated_at)}}</div>
                  </div>
                  <div class="list-other">
                    <div>
                      <span class="last_msg" v-html="formatLastMsg(item.room.last_msg)"></span>
                    </div>
                    <div v-if="alert && item.is_alert">
                      <div v-if="item.unread_number" type="danger">{{item.unread_number}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-submenu>
         
        </el-menu>
      </el-col>
      <el-col :span="16" style="height: 100%;">
        <room v-if="roomStatus"></room>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import vImg from '@/components/v-img'
import room from '../components/room';
import utils from "@/utils/utils";
import { roomGet } from "@/socketioApi/room";
import storage from "@/utils/localstorage";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { setup } from "@/utils/socketio";
import { joinChatSend } from "@/socketIoApi/chat";
export default {
  components: { vImg,room },
  name: "home",
  data() {
    return {
      activeIndex:"0",
      alert: true,
      loading: true,
      defShow: false,
      mask_show: false,
      defs: [
        {
          label: "发起群聊",
          callback: () => {
            this.$router.push({ name: "groupChat" });
          }
        },
        {
          label: "添加朋友",
          callback: () => {
            this.$router.push({ name: "search" });
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "navbarTitle",
      "roomList",
      "msgList",
      "groupRoomList",
      "RECORD",
      "TEXT",
      "IMG",
      "FILE",
      "CHAT_NOTIFY",
      "roomStatus"
    ])
  },
  methods: {
    ...mapMutations({
      updateRoomList: "updateRoomList",
      updateGroupRoomList: "updateGroupRoomList",
      updateMsgList: "updateMsgList"
    }),
    init() {
      window.physicsBackRouter = null;
      if (window.localStorage.getItem("alert") == undefined) {
        this.alert = true;
      } else {
        this.alert = storage.get("alert");
      }
      roomGet().then(res => {
        console.log("222222",res)
        if (res.data.list != null) {
          this.updateRoomList(res.data.list);
          this.loading = false;
        }
      });
      userRoomRelationGet().then(res => {
        if (res.data.list != null) {
          this.updateGroupRoomList(res.data.list);
          this.loading = false;
        }
      });
    },
    handleJoinRoom(item,index) {
      this.$store.commit("updateRoomStatus", false);
      this.activeIndex = index;
      console.log(this.activeIndex)
      joinChatSend({
        name: item.type == 1 ? item.adminUsers.nick_name : item.users.nick_name,
        room_uuid: item.room_uuid,
        type: item.room.type,
        save_action: item.save_action
      });
    },
    handleJoinGroupRoom(item) {
      joinChatSend({
        name: item.room.name,
        room_uuid: item.room_uuid,
        type: item.room.type,
        save_action: item.save_action
      });
    },
    formatTime(value) {
      return utils.time.formatDate(value, "hh:mm:ss");
    },
    formatLastMsg(last_msg) {
      try {
        let data = JSON.parse(last_msg);
        if (data["type"] == this.IMG) {
          return "[图片]";
        }
        if (data["type"] == this.FILE) {
          return "[文件]";
        }
        if (data["type"] == this.RECORD) {
          return "[语音]";
        }
        if (data["type"] == this.TEXT) {
          return data["msg"];
        }
        if (data["type"] == this.CHAT_NOTIFY) {
          return JSON.parse(data["msg"])["msg"];
        }
        return data["msg"];
      } catch (e) {
        return last_msg;
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.content{
  height:100%;
}
/* .el-menu-vertical{
  height:100%;
} */
.room_wrap{
  padding-left:10px;
  display: flex;
  flex-direction: row;
}
.room-wrap-hover {
  background-color: #ecf5ff;
}
.list-img img{
  width: 40px;
  height: 40px;
}
.list-mes{
  padding-left:10px;
  width: calc(100% - 40px);
  .list-title{
    height:28px;
    line-height:28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width:100%;
    .title-left{
      width:50%;
     /*  text-overflow: ellipsis; */
      overflow: hidden;
      display: inline-block;

    }
    .title-right{
      width:40%;
      text-align:right;
      display: inline-block;
      padding-right:10px;
    }
  }
  .list-other{
    height:25px;
    line-height:25px;
  }
}
.home-room-list-wrap:hover {
  overflow: auto;
}
</style>
