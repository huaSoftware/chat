<!--
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 设置页码
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:38:14
 -->

<template>
  <div class="content">
    <!-- 功能区 -->
    <!-- <CrossItem name="账号和安全" :borderBot="false" :isIcon="false">  
    </CrossItem>-->
    <CrossLine></CrossLine>
    <CrossItem
      name="新消息提醒"
      :borderBot="true"
      :isIcon="false"
      @click.native="$router.push({name: 'mySetAlert'})"
    ></CrossItem>
    <CrossItem
      name="清空添加好友记录"
      :borderBot="true"
      :isIcon="false"
      @click.native="handleClean('addressBookBeg')"
    ></CrossItem>
    <CrossItem name="清空聊天记录" :borderBot="true" :isIcon="false" @click.native="handleClean('msg')"></CrossItem>
    <!-- <CrossItem name="关于我们" :borderBot="true" :isIcon="false" @click.native="$router.push({name: 'mySetAbout'})">    
    </CrossItem>-->
    <!-- <CrossItem name="帮助和反馈" :borderBot="true" :isIcon="false">  
    </CrossItem>-->
    <CrossLine></CrossLine>
    <CrossItem @click.native="handleExit" name="退出" :borderBot="true" :isIcon="false"></CrossItem>
  </div>
</template>
<script>
import CrossLine from "@/components/cross-line/cross-line";
import CrossItem from "@/components/cross-item/cross-item";
import { Confirm } from "vue-ydui/dist/lib.rem/dialog";
import { deleteTables } from "@/utils/indexedDB";
import { mapGetters } from "vuex";
import { setDown, send } from "@/utils/socketio";
import { clearData } from "@/utils/auth";

export default {
  components: { CrossLine, CrossItem },
  data() {
    return {};
  },
  methods: {
    go() {
      alert(1);
    },
    handleClean(name) {
      this.$dialog.confirm({
        title: "是否清除",
        mes: "清除后不可还原",
        opts: () => {
          window.indexedDB.deleteDatabase(name);
          this.$dialog.toast({ mes: "清除成功", timeout: 1000 });
        }
      });
    },
    handleExit() {
      Confirm({
        title: "提示",
        mes: "确认退出？退出后本地记录将自动删除！",
        opts: [
          {
            txt: "取消",
            color: false,
            callback: () => {}
          },
          {
            txt: "确定",
            color: true,
            callback: () => {
              //更新在线状态
              clearInterval(window.loginConnectInterval);
              clearTimeout(window.sendTimeOut)
              clearTimeout(window.broadcastTimeOut)
              clearTimeout(window.timeOut);
              send("logoutDisconnect", {}, "logoutDisconnect");
              //监听
              clearData();
              setDown();
              deleteTables();
              setTimeout(() => {
                this.$router.push({ name: "authLogin" });
              }, 100);
            }
          }
        ]
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
.header_wrapper {
  background: #fff;
  width: 100%;
  height: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.header_img {
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  left: 0.3rem;
  margin-top: 0.3rem;
}
.header_name {
  margin-left: 2.3rem;
  margin-top: 0.3rem;
  font-weight: bold;
  font-size: 0.4rem;
}
.header_id {
  margin-left: 2.3rem;
  margin-top: 0.3rem;
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
</style>