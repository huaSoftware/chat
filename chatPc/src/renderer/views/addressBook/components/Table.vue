<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:36
 * @description: 通讯录
 * @LastEditors: hua
 * @LastEditTime: 2020-11-05 21:12:26
 -->
<template>
  <div class="content">
    <el-row style="height:100%">
      <el-col class="address-book-list" :span="8" style="height:100%;overflow:auto;border-right: solid 1px #e6e6e6;">
        <!-- 列表 -->
        <dl v-for="num in 26" :key="num">
          <dt :ref="String.fromCharCode(64+num)">{{String.fromCharCode(64+num)}}</dt>
          <dd
            @click="handleActive(item,index)"
            v-for="(item, index) in adderssBookList"
            :key="index"
            v-if="String.fromCharCode(64+num) == item.users.first_word && item.type==0"
            :class="activeIndex === index?'address-book-item-hover':''"
          >
            <a>
              <vImg :imgUrl="item.users.head_img" />
              {{item.users.nick_name}}
            </a>
          </dd>
        </dl>
        <dl>
          <dt :ref="'#'">#</dt>
          <dd
            @click="handleActive(item,index)"
            v-for="(item, index) in adderssBookList"
            :key="index"
            v-if="item.users.first_word == '#'"
            :class="activeIndex === index?'address-book-item-hover':''"
          >
           
            <a>
              <vImg :imgUrl="item.users.head_img" />
              {{item.users.nick_name}}
            </a>
          </dd>
        </dl>
      </el-col>
      <el-col :span="16" style="height: 100%;">
          <el-row style="height:100%;padding:50px;" v-if="JSON.stringify(localItem.users)!=='{}'">
            <div class="header-row">
              <div class="header-column">
                <div class="header-name">{{localItem.users.nick_name}}</div>
                <div class="header-des">{{localItem.users.email}}</div>
              </div>
              <vImg :img-url="localItem.users.head_img" class="header-img"/>
            </div>
            <div class="body-column">
              <div class="body-row">
                <div class="body-name">是否在线</div>
                <div class="body-des">{{localItem.users.online}}</div>
              </div>
              <div class="body-row">
                <div class="body-name">房间编号</div>
                <div class="body-des">{{localItem.room.room_uuid}}</div>
              </div>
              <div class="body-row">
                <div class="body-name">创建时间</div>
                <div class="body-des">{{formatTime(localItem.room.created_at)}}</div>
              </div>
              <div class="body-row">
                <div class="body-name">更新时间</div>
                <div class="body-des">{{formatTime(localItem.room.updated_at)}}</div>
              </div>
            </div>
            <div class="btn-center">
              <el-button type="success" class="send-btn" @click="handleJoinRoom">发消息</el-button>
            </div>
          </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { addressBookGet } from "@/socketioApi/addressBook";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { joinChatSend } from "@/socketIoApi/chat";
import utils from "@/utils/utils";
import vImg from "@/components/v-img";
import { Message } from "element-ui";
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
      activeIndex:"",
      localItem:{users:{},room:{}},
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
      Message({
          message:value,
          type: "success",
          duration: 5 * 1000,
      });
    },
    handleScroll() {},
    handleActive(item,index){
      console.log(item)
      this.localItem = item;
      this.activeIndex = index;
    },
    handleJoinRoom() {
       //传参给home页
      this.$router.push({ name: 'Home',query: this.localItem})
      /* joinChatSend({
        name: this.localItem.users.nick_name,
        room_uuid: this.localItem.room_uuid,
        type: this.localItem.room.type,
        save_action: this.localItem.save_action
      }); */
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
      if(!value){
        return
      }
      return utils.time.formatDate(value, "yyyy-MM-dd hh:mm:ss");
    },
  },
  created() {
    this.init();
  },
  mounted() {
    /* document
      .getElementById("scrollView")
      .addEventListener("scroll", this.handleScroll); */
  }
};
</script>
<style lang="scss" scoped>
.content{
  height:100%;
}
.activeaddress-book {
  color: red !important;
}
dl {
  background-color: #fff;
  margin:0px;
}

.address-book-list {
  margin-bottom: 0px;
}

.address-book-list dt {
  color: #666;
  height: 30px;
  line-height: 30px;
  text-indent: 0.2rem;
  background-color: #f7f7f7;
  position: relative;
  padding-left: 10px;
}

.address-book-list dd {
/*   padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px; */
  margin: 0px;
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
  height: 50px;
  position: relative;
  line-height: 50px;
}

.address-book-list dd a img {
  float: left;
  /* margin: .25rem .5rem 0 0.25rem; */
  height: 27.5px;
  width: 27.5px;
  margin-right: 5%;
  margin-top:10px;
  margin-left:10px;
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
  top: 50%;
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
.address-book-item-hover{
  background-color: #ecf5ff;
}
.header-row{
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom:20px;
  border-bottom: 1px solid rgb(230, 230, 230);
}
.header-column{
  display:flex;
  flex-direction: column;
}
.header-name{
  font-size:24px;
  line-height: 24px;
}
.header-des{
  font-size:14px;
  line-height: 14px;
  margin-top:15px;
  color:#999999;
}
.header-img{
  height:60px;
}
.body-row{
  display:flex;
  flex-direction: row;
  justify-content: flex-start;
}
.body-column{
  display:flex;
  flex-direction: column;
  padding-bottom:20px;
  padding-top:20px;
  border-bottom: 1px solid rgb(230, 230, 230);
}
.body-name{
  font-size:14px;
  line-height: 29px;
  color:#999999;
  margin-right:25px;
}
.body-des{
  font-size:14px;
  line-height: 29px;
}
.send-btn{
  width:150px;
}
.btn-center{
  display: flex;
  justify-content: center;
  margin-top:30px;
}
</style>