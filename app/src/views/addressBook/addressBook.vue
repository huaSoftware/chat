<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:36
 * @description: 通讯录
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:30:48
 -->
<template>
  <div class="content">
    <!-- 头部开始 -->
    <header class="yd-navbar header">
      <div class="yd-navbar-item"></div>
      <div class="yd-navbar-center-box" style="height: 1rem;">
        <div class="yd-navbar-center">
          <span
            class="yd-navbar-center-title"
            style="color: rgb(92, 92, 92); font-size: 0.3rem;"
          >通讯录</span>
        </div>
      </div>
      <div class="yd-navbar-item" @click="defShow=!defShow">
        <!-- <span class="icon-custom-8888 navbar_icon"></span> -->
        <span class="icon-custom-jia2 navbar_icon"></span>
      </div>
    </header>
    <!-- 头部结束 -->
    <!-- 功能栏 -->
    <yd-actionsheet :items="defs" v-model="defShow" cancel="取消"></yd-actionsheet>
    <!-- 群组 -->
    <yd-accordion>
      <yd-accordion-item title="群聊">
        <div style="padding: .24rem;">
          <dl>
            <dt></dt>
            <dd
              @click="handleJoinGroupRoom(item)"
              v-for="(item, index) in groupRoomList"
              :key="index"
            >
              <a>
                <img src="@/assets/img/default.jpg" />
                {{item.room.name}}
              </a>
            </dd>
          </dl>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <!-- 列表 -->
    <div class="address-book-list">
      <dl v-for="num in 26" :key="num">
        <dt :ref="String.fromCharCode(64+num)">{{String.fromCharCode(64+num)}}</dt>
        <dd
          @click="handleJoinRoom(item)"
          v-for="(item, index) in adderssBookList"
          :key="index"
          v-if="String.fromCharCode(64+num) == item.users.first_word && item.type==0"
        >
          <!-- 循环 -->
          <a>
            <vImg :imgUrl="item.users.head_img" />
            {{item.users.nick_name}}
          </a>
        </dd>
      </dl>
      <dl>
        <dt :ref="'#'">#</dt>
        <dd
          @click="handleJoinRoom(item)"
          v-for="(item, index) in adderssBookList"
          :key="index"
          v-if="item.users.first_word == '#'"
        >
          <!-- 循环 -->
          <a>
            <vImg :imgUrl="item.users.head_img" />
            {{item.users.nick_name}}
          </a>
        </dd>
      </dl>
    </div>
    <!-- 导航 -->
    <div id="pop-address-book-letter" class="clearfix">
      <ul>
        <li v-for="num in 26" :key="num" @click="handleScrollToRef(String.fromCharCode(num+64))">
          <a
            :class="activeName==String.fromCharCode(num+64)?'activeName':''"
          >{{String.fromCharCode(num+64)}}</a>
        </li>
        <li>
          <a :class="activeName=='#'?'activeName':''" @click="handleScrollToRef('#')">#</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { addressBookGet } from "@/socketioApi/addressBook";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";
import { joinChatSend } from "@/socketioApi/chat";
import vImg from "@/components/v-img/v-img";
export default {
  components: { vImg },
  data() {
    return {
      reqData: {
        page_no: 1,
        per_page: 10000000
      },
      adderssBookList: [],
      defShow: false,
      activeName: "",
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
    ...mapGetters(["groupRoomList", "htmlFontSize"])
  },
  methods: {
    ...mapMutations({
      updateGroupRoomList: "updateGroupRoomList"
    }),
    init() {
      window.physicsBackRouter = null;
      addressBookGet(this.reqData).then(res => {
        console.log(111111111111111111, res);
        if (res.data.addressBookList) {
          this.adderssBookList = res.data.addressBookList;
        }
      });
      userRoomRelationGet().then(res => {
        if (res.data.list) {
          this.updateGroupRoomList(res.data.list);
        }
        this.loading = false;
      });
    },
    handleScrollToRef(value) {
      console.log(this.$refs[value]);
      if (value == "#") {
        document.getElementById("scrollView").scrollTop =
          this.$refs[value].offsetTop - this.htmlFontSize;
      } else {
        document.getElementById("scrollView").scrollTop =
          this.$refs[value][0].offsetTop - this.htmlFontSize;
      }
      this.activeName = value;
      Toast({ mes: value });
    },
    handleScroll() {},
    handleJoinRoom(item) {
      joinChatSend({
        name: item.users.nick_name,
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
    }
  },
  created() {
    this.init();
  },
  mounted() {
    document
      .getElementById("scrollView")
      .addEventListener("scroll", this.handleScroll);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
.header {
  background-color: rgb(255, 255, 255);
  height: 1rem;
  color: rgb(228, 228, 228);
  position: fixed;
  width: 100%;
  max-width: 750px;
  min-width: 300px;
}
.activeaddress-book {
  color: red !important;
}
dl {
  background-color: #fff;
}

.address-book-list {
  margin-bottom: 0px;
}

.address-book-list dt {
  color: #666;
  height: 0.7rem;
  line-height: 0.7rem;
  text-indent: 0.2rem;
  background-color: #f7f7f7;
  position: relative;
  padding-left: 10px;
}

.address-book-list dd {
  margin-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
}

.address-book-list dd.hot {
  padding-bottom: 0.25rem;
}

.address-book-list dd.hot a {
  height: 27.5px;
  width: 33.3%;
  float: left;
  border-bottom: none;
  text-align: center;
  height: inherit;
  line-height: inherit;
}

.address-book-list dd a {
  display: block;
  height: 27.5px;
  line-height: 2.75rem;
  position: relative;
  line-height: 27.5px;
}

.address-book-list dd a img {
  float: left;
  /* margin: .25rem .5rem 0 0.25rem; */
  height: 27.5px;
  width: 27.5px;
  margin-right: 5%;
}

.address-book-list dd.hot a span {
  display: block;
  padding-bottom: 0.25rem;
}

.address-book-list dd.hot a img {
  float: none;
  margin: 0.25rem auto 0;
}

.address-book-list dd.hot a {
  width: 33.3%;
  float: left;
  border-bottom: none;
  text-align: center;
  height: inherit;
  line-height: inherit;
}

/* 导航 */
#pop-address-book-letter {
  font-size: 0.6rem;
  position: fixed;
  right: 0;
  top: 55%;
  width: 1rem;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}

#pop-address-book-letter li a {
  display: block;
  /* height:0.9rem;
    line-height: 1.1rem; */
  text-align: center;
  color: #576b95;
  font-size: 0.3rem;
}

.navbar_icon {
  color: rgb(92, 92, 92);
  font-size: 0.45rem;
  margin-left: 0.3rem;
}

dd {
  margin-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
}
dd a {
  display: block;
  height: 27.5px;
  line-height: 2.75rem;
  position: relative;
  line-height: 27.5px;
}
dd a img {
  float: left;

  height: 27.5px;
  width: 27.5px;
  margin-right: 5%;
}
.activeName {
  color: #45baf4 !important;
}
</style>