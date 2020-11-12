<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 我的页面
 * @LastEditors: hua
 * @LastEditTime: 2020-11-12 21:07:29
 -->

<template>
  <div class="content">
    <el-dialog title="添加好友记录" :visible.sync="visible">
     <newFriend v-if="visible"></newFriend>
    </el-dialog>
    <div class="header_wrapper">
      <vImg class="header_img" :imgUrl="userInfo.head_img" />
      <div class="header_body">
        <div class="header_name">
          {{ userInfo.nick_name }}
        </div>
        <div class="header_id">账号：{{ userInfo.email }}</div>
      </div>
      <!-- <span class="icon-custom-you icon_right"></span> -->
    </div>

    <!-- 功能区 -->
    <div class="item" @click="visible=true">
      添加好友记录
      <el-badge  v-if="newFriendAlertNumber > 0" :value="newFriendAlertNumber"></el-badge>
    </div>
    <div class="item" @click="handleClean('addressBookBeg')">清空添加好友记录</div>
    <div class="item" @click="handleClean('msg')">清空聊天记录</div>
    <div class="item" @click="handleExit">退出</div>
    <!-- <CrossItem name="添加好友记录"  @click.native="$router.push({name: 'newFriend'})">
        <yd-badge   type="danger" v-if="newFriendAlertNumber > 0">{{newFriendAlertNumber}}</yd-badge>
        <span class="icon-custom-jia font18 icon_style" v-else></span>
    </CrossItem> -->
    <!-- <CrossItem name="收藏" :borderBot="false">
        <span class="icon-custom-guanzhu2 font18 icon_style"></span>
    </CrossItem> -->

    <!-- <CrossItem name="设置" :borderBot="false" @click.native="$router.push({name: 'mySet'})">
        <span class="icon-custom-shezhi2 font18 icon_style"></span>
    </CrossItem> -->
  </div>
</template>
<script>
import vImg from "@/components/v-img";
import { mapGetters } from "vuex";
import { userInfo } from "@/socketioApi/user";
import { MessageBox, Message } from "element-ui";
import { deleteTables } from "@/utils/indexedDB";
import { setDown, send } from "@/utils/socketio";
import { clearData } from "@/utils/auth";
import newFriend from "@/components/newFriend/newFriend";
export default {
  components: { vImg,newFriend },
  data() {
    return {
      userInfo: {},
      visible:false
    };
  },
  computed: {
    ...mapGetters(["newFriendAlertNumber"]),
  },
  methods: {
    init() {
      window.physicsBackRouter = null;
      userInfo().then((res) => {
        console.log(res);
        this.userInfo = res.data;
        this.$store.commit("user/updateUserInfo", res.data);
      });
    },
    handleClean(name) {
      MessageBox.confirm(`是否清除?清除后不可还原`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
        window.indexedDB.deleteDatabase(name);
        Message({
          message:`清除成功`,
          type: "success",
          duration: 5 * 1000,
        });
      })
    },
    handleExit() {
      MessageBox.confirm(`确认退出？退出后本地记录将自动删除！`, {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
          this.$store.dispatch('user/logout').then(res=>{
            this.$router.push(`/login`)
          })
      })
    }
  },
  created() {
    this.init();
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.content{
  padding:50px;
}
.header_wrapper {
  background: #fff;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding-bottom:20px;
  border-bottom: 1px solid rgb(230, 230, 230);
}
.header_img {
  width: 60px;
  height: 60px;
}
.header_body {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-left:20px;
}
.header_name {
  font-weight: bold;
  font-size: 30px;
}
.header_id {
  margin-top:10px;
}
.icon_style {
  display: inline-block;
  line-height: 1rem;
}
.icon_right {
  font-weight: bold;
  font-size: 0.5rem;
  float: right;
  line-height: 1rem;
  color: #aaaaaa;
  position: absolute;
  margin-top: 0.8rem;
  right: 0.2rem;
}
.item{
  border-bottom: 1px solid rgb(230, 230, 230);
  height:60px;
  line-height:30px;
  padding-top:20px;
  padding-bottom:10px;
  padding-left:10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
}
.item:hover{
  background-color: #ecf5ff;
}
</style>