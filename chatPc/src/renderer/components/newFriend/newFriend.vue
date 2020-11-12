<!--
 * @Author: hua
 * @Date: 2019-02-16 19:35:43
 * @description: 新的朋友列表
 * @LastEditors: hua
 * @LastEditTime: 2020-11-12 21:37:48
 -->
<template>
  <div class="newFriend_content">
    <div class="yd-list yd-list-theme4">
      <a
        href="javascript:;"
        class="yd-list-item"
        v-for="(item, index) in newFriendList"
        :key="index"
      >
        <div class="yd-list-img">
          <vImg :imgUrl="item.head_img" />
        </div>
        <div class="yd-list-mes">
          <div class="yd-list-title">
            <span class="title-left">{{item.nick_name}}</span>
            <span class="title-right">{{formatDate(item.updated_at)}}</span>
          </div>
          <div class="yd-list-other">
            <div>
              <span class="demo-list-price"></span>
            </div>
            <div>
              <el-button
                v-if="item.status==0"
                size="mini"
                type="primary"
                shape="circle"
                @click.native="newFriendAdd(item)"
              >接受</el-button>
              <span v-else-if="item.status==1">已通过</span>
              <span v-else-if="item.status==2">拒绝</span>
            </div>
          </div>
        </div>
      </a>
    </div>
    <!-- 参数空时页面 -->
    <div class="empty" v-if="newFriendList.length==0 && loading==false">
      <span class="empty_text">暂无好友邀请</span>
    </div>
  </div>
</template>

<script type="text/babel">
import vImg from "@/components/v-img";
import { getAddressBookBeg, delAddressBookBeg } from "@/utils/indexedDB";
import { MessageBox } from "element-ui";
import utils from "@/utils/utils";
import storage from "@/utils/localstorage";
import { addressBookAdd } from "@/socketioApi/addressBook";
import { roomGet } from "@/socketioApi/room";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";

export default {
  data() {
    return {
      newFriendList: [],
      loading: false
    };
  },
  components: { vImg },
  created() {
    this.init();
  },
  methods: {
    init() {
      getAddressBookBeg().then(res => {
        let newFriendAlertNumber = 0;
        this.newFriendList = res;
        console.log(newFriendList)
        this.newFriendList.forEach(item => {
          if (item.status == 0) {
            newFriendAlertNumber++;
          }
        });
        this.$store.commit("updateNewFriendAlertNumber", newFriendAlertNumber);
      });
    },
    newFriendAdd(item) {
      let reqData = {
        focused_user_id: item.user_id
      };
      addressBookAdd(reqData).then(response => {
        delAddressBookBeg(item.user_id).then(res => {
          let newFriendAlertNumber = 0;
          this.newFriendList = res;
          this.newFriendList.forEach(item => {
            if (item.status == 0) {
              newFriendAlertNumber++;
            }
          });
          this.$store.commit(
            "updateNewFriendAlertNumber",
            newFriendAlertNumber
          );
          MessageBox.confirm(response.msg, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
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
                    }
                    this.updateRoomList(localRoomList);
                    this.$router.push({ name: "Home" });
                  });
                });
              })
          })
        });
      });
    },
    formatDate(value) {
      return utils.time.formatDate(value, "MM-dd hh:mm");
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.yd-list-theme4 .yd-list-item .yd-list-img {
  width: 60px;
  padding: 30px 0;
}

.yd-list-theme4 .yd-list-item .yd-list-title {
  line-height: 30px;
  max-height: 30px!important;
}
.title-right {
  font-weight: normal;
  float: right;
  font-size: 16px;
  width: 30%;
  overflow: hidden;
  text-align: right;
}
.title-left {
  width: 50%;
  overflow: hidden;
  font-size:16px;
}
/* 页面为空时 */
.empty {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
}
.icon-custom-tongxunlu {
  font-size: 16px;
  position: relative;
  display: block;
  text-align: center;
}
.icon-custom-tongxunlu:before {
  color: #aaaaaa;
}
.empty_text {
  width: 100%;
  display: block;
  text-align: center;
  color: #aaaaaa;
  font-size: 20px;
}
</style>