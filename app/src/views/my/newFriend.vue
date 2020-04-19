<!--
 * @Author: hua
 * @Date: 2019-02-16 19:35:43
 * @description: 新的朋友列表
 * @LastEditors: hua
 * @LastEditTime: 2020-04-19 20:28:57
 -->
<template>
  <div class="newFriend_content">
    <vTitle name="新的朋友"></vTitle>
    <article class="yd-list yd-list-theme4">
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
              <yd-button
                v-if="item.status==0"
                size="small"
                type="primary"
                shape="circle"
                @click.native="newFriendAdd(item)"
              >接受</yd-button>
              <span v-else-if="item.status==1">已通过</span>
              <span v-else-if="item.status==2">拒绝</span>
            </div>
          </div>
        </div>
      </a>
    </article>
    <!-- 参数空时页面 -->
    <div class="empty" v-if="newFriendList.length==0 && loading==false">
      <span class="icon-custom-tongxunlu"></span>
      <span class="empty_text">暂无好友邀请</span>
    </div>
  </div>
</template>

<script type="text/babel">
import vTitle from "@/components/v-title/v-title";
import vImg from "@/components/v-img/v-img";
import { getAddressBookBeg, delAddressBookBeg } from "@/utils/indexedDB";
import { Alert } from "vue-ydui/dist/lib.rem/dialog";
import utils from "@/utils/utils";
import storage from "@/utils/localstorage";
import { addressBookAdd } from "@/socketioApi/addressBook";
export default {
  data() {
    return {
      newFriendList: [],
      loading: false
    };
  },
  components: { vTitle, vImg },
  created() {
    this.init();
  },
  methods: {
    init() {
      getAddressBookBeg().then(res => {
        let newFriendAlertNumber = 0;
        this.newFriendList = res;
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
          Alert({
            mes: response.msg,
            callback: () => {
              this.$router.push({ name: "home" });
            }
          });
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
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
.yd-list-theme4 .yd-list-item .yd-list-img {
  width: 1.2rem;
  padding: 0.6rem 0;
}

.yd-list-theme4 .yd-list-item .yd-list-title {
  line-height: 0.6rem;
}
.title-right {
  font-weight: normal;
  float: right;
  font-size: 12px;
  width: 30%;
  overflow: hidden;
  text-align: right;
}
.title-left {
  width: 50%;
  overflow: hidden;
}
/* 页面为空时 */
.empty {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
}
.icon-custom-tongxunlu {
  font-size: 2rem;
  position: relative;
  display: block;
  text-align: center;
  padding-top: 30%;
}
.icon-custom-tongxunlu:before {
  color: #aaaaaa;
}
.empty_text {
  width: 100%;
  display: block;
  text-align: center;
  color: #aaaaaa;
  font-size: 0.56rem;
  margin-top: 0.2rem;
}
</style>