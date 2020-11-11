<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:47
 * @description: 首页
 * @LastEditors: hua
 * @LastEditTime: 2020-11-11 21:37:21
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
            :index="`${String(index)}`"
            v-if="item.room"
            >
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
                    <div class="title-left" v-if="item.type ==0&& item.room.type ==0">{{item.users.nick_name}}</div>
                    <div class="title-left" v-if="item.room.type == 1">{{item.room.name}}</div>
                    <div class="title-right">{{formatTime(item.room.updated_at)}}</div>
                  </div>
                  <div class="list-other">
                    <div class="other-left">
                      <span class="last_msg" v-html="formatLastMsg(item.room.last_msg)"></span>
                    </div>
                    <div v-if="alert && item.is_alert" class="other-right">
                      <el-badge style="margin-top:6px" v-if="item.unread_number" :value="item.unread_number">
                    </el-badge>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-submenu>
         
        </el-menu>
      </el-col>
      <el-col :span="16" style="height: 100%;">
        <room v-if="roomStatus === 0 || roomStatus === 3"></room>
        <groupRoom v-if="roomStatus === 1"></groupRoom>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import vImg from '@/components/v-img'
import room from '../components/room';
import groupRoom from '../components/groupRoom';
import utils from "@/utils/utils";
import { roomGet } from "@/socketioApi/room";
import storage from "@/utils/localstorage";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { setup } from "@/utils/socketio";
import { joinChatSend } from "@/socketIoApi/chat";
export default {
  components: { vImg, room, groupRoom },
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
      function compare(property){ 
        return function(a,b){ 
          var value1 = a[property]; 
          var value2 = b[property]; 
          return !(value1 - value2); 
        } 
      }
      setTimeout(()=>{
        roomGet().then(res => {
          console.log("222222",res)
          let localRoomList = [];
          if (res.data.list != null) {
            localRoomList = res.data.list;
            console.log(res.data.list)
          }
          console.log(localRoomList)
          userRoomRelationGet().then(resRoomRelation => {
            if (resRoomRelation.data.list != null) {
              localRoomList = localRoomList.concat(resRoomRelation.data.list);
              localRoomList.sort(compare('updated_at'))
              //this.updateGroupRoomList(resRoomRelation.data.list);
            }
            console.log(localRoomList)
            this.updateRoomList(localRoomList);
            this.loading = false;
            if(this.$route.query.hasOwnProperty("id")){
              localRoomList.forEach((item,index)=>{
                if(item.room_uuid === this.$route.query.room_uuid){
                  this.handleJoinRoom(item,index);
                  return;
                }
              })
            }
          });
        });
      })
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
        return data["msg"]+"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      } catch (e) {
        return last_msg+"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
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
    display: flex;
    justify-content: space-between;
    .other-left{
      width:80%;
      overflow: hidden;
      text-overflow:ellipsis;
    }
    .other-right{
      width:20%;
      text-align: right;
      padding-right: 10px;
    }
  }
}
.home-room-list-wrap:hover {
  overflow: auto;
}
</style>
