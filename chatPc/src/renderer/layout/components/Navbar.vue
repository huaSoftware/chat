<!--
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-11-12 21:32:41
 -->
<template>
  <el-menu class="navbar" mode="horizontal">
   <!--  <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger> -->
   <!--  <breadcrumb></breadcrumb> -->
   <el-button class="btn" @click="addFriendVisible=true" size="small" round style="margin-left:10px;">
    <svg-icon icon-class="zengjiarenyuan" class="icon" />
   </el-button>
   <el-button class="btn" @click="addFriendsVisible=true" size="small" round style="margin-left:10px;">
    <svg-icon icon-class="zengjiaqunzu" class="icon" />
   </el-button>
   <el-dialog :close-on-click-modal="false" title="添加好友" :visible.sync="addFriendVisible">
     <addFriend v-if="addFriendVisible"></addFriend>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="创建群组" :visible.sync="addFriendsVisible">
     <addFriends v-if="addFriendsVisible" @handleCloseAddFriends="handleCloseAddFriends"></addFriends>
    </el-dialog>
   <el-dialog title="添加好友记录" :visible.sync="visible">
     <newFriend v-if="visible"></newFriend>
    </el-dialog>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="require('@/assets/img/default.png')" />
        <i class="el-icon-caret-bottom"></i>
        <el-badge  style="position: absolute;top:-10px;left:28px;" v-if="newFriendAlertNumber > 0" :value="newFriendAlertNumber"></el-badge>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <!-- <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link> -->
        <el-dropdown-item>
          <span @click="visible=true" style="display:block;">添加好友记录<el-badge  style="position: absolute;top:10px;right:5px;" v-if="newFriendAlertNumber > 0" :value="newFriendAlertNumber"></el-badge></span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="handleClean('addressBookBeg')" style="display:block;">清空好友记录</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="handleClean('msg')" style="display:block;">清空聊天记录</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import newFriend from "@/components/newFriend/newFriend";
import addFriend from "@/components/addFriend/addFriend";
import addFriends from "@/components/addFriends/addFriends";
import {ipcRenderer} from 'electron';
import { MessageBox, Message } from "element-ui";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    newFriend,
    addFriend,
    addFriends
  },
  data() {
    return {
      visible:false,
      addFriendVisible:false,
      addFriendsVisible:false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar","newFriendAlertNumber"]),
  },
  methods: {
    handleCloseAddFriends(){
      this.addFriendsVisible = false;
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
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
    logout() {
      this.$store.dispatch('user/logout').then(res=>{
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })   
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon{
  font-size:13px;
  fill:#606266!important;
}
.btn:hover .icon{
  fill:#409EFF!important;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
