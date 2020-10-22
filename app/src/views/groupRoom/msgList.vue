<!--
 * @Author: hua
 * @Date: 2019-07-15 11:29:43
 * @description: 聊天记录
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:16:19
 -->
<template>
  <div class="room_msg_list" id="msg_list_empty">
        <!--mescroll滚动区域的基本结构-->
        <mescroll-vue  ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div style="display:flex;flex-direction:column">
                <div v-for="(item, index) in list" :key="index">
                    <div class="title">
                        <div>{{item.name}}</div> 
                        <div>{{formatTime(item.created_at)}}</div>
                    </div>
                    
                    <div class="msg" v-if="item.type != TEXT">{{formatMsg(item)}}</div>
                    <div class="msg" v-else v-html="item.msg"></div>
                </div>
                
            </div>
        </mescroll-vue>
  </div>
</template>
<script>
import { mapGetters, mapMutations} from "vuex"
import utils from '@/utils/utils'
import MescrollVue from "mescroll.js/mescroll.vue"
import {getLocalRoomMsg} from "@/utils/indexedDB"
import {getCloudRoomMsg} from '@/socketioApi/room'
import {joinChatSend} from '@/socketIoApi/chat'
export default {
  components: {
    MescrollVue
  },
    computed: {
      ...mapGetters([
        "msgList",
        "currentRoomUuid",
        "currentRoomName",
        "currentRoomType",
        "currentRoomSaveAction",
        "RECORD","TEXT","IMG","FILE","CHAT_NOTIFY"
      ])
    },
  data() {
    return {
      list: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
        isLock: true
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        /* 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                    这就是为什么无更多数据有时候不显示的原因 */
        toTop: {
          //回到顶部按钮
          src: null, //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "msg_list_empty", //父布局的id (1.3.5版本支持传入dom元素)
          icon: null, //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  watch: {},
  methods: {
    init() {
    },
    handleTaskQuery(orderField) {
      this.reqData.orderField = orderField;
      this.mescroll.resetUpScroll();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
        if(this.currentRoomSaveAction == 0){
          getLocalRoomMsg(this.currentRoomUuid,page.num, page.size)
              .then(res => {
              // 请求的列表数据
              // 如果是第一页需手动制空列表
              if (page.num === 1) this.list = [];
              // 把请求到的数据添加到列表
              this.list = this.list.concat(res.list);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endBySize(res.list.length, res.total);
              });
          })
          .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
          });
        }else if(this.currentRoomSaveAction == 1){
          getCloudRoomMsg({room_uuid:this.currentRoomUuid,page_no:page.num, per_page:page.size})
              .then(res => {
              // 请求的列表数据
              // 如果是第一页需手动制空列表
              if (page.num === 1) this.list = [];
              // 把请求到的数据添加到列表
              let rawList = res.data.list
              rawList.map(item => {
                item['msg'] =  item['formatMsg']
                delete item['formatMsg']
                return item
              })
              this.list = this.list.concat(rawList);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endBySize(res.data.list.length, res.data.page.count);
              });
          })
          .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr();
          });
        }
    },
    formatMsg(data){
      console.log(data)
      try{
        if(data['type'] == this.IMG ){
          return '[图片]'
        }
        if(data['type'] == this.FILE ){
          return '[文件]'
        }
        if(data['type'] == this.RECORD ){
          return '[语音]'
        }
        if(data['type'] == this.TEXT ){
          return data['msg']
        }
         if(data['type'] == this.CHAT_NOTIFY ){
          return JSON.parse(data['msg'])['msg']
        }
        return data['msg']
      }catch(e){
        return msg
      }
		},
    formatTime(value){
      return utils.time.formatDate(value, 'hh:mm:ss')
    }
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    if(to.name == 'room'){
      joinChatSend({
        name: this.currentRoomName,
        room_uuid: this.currentRoomUuid,
        type: this.currentRoomType,
        save_action:this.currentRoomSaveAction
      })
    }
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  }
};
</script>
<style lang="scss" scoped>
/*通过fixed固定mescroll的高度*/
.mescroll {
    position: fixed;
    padding:0.24rem;
    top: 1.5rem;
    bottom: 0;
    height: auto;
}
.title{
    color:#00C2E6;
    line-height: 0.6rem;
    height:0.6rem;
    display: flex;
    justify-content:space-between;
    flex-direction: row;
}
.msg{
    font-weight: bold;
    line-height: 0.6rem;
    border-bottom:  1px solid #e9e9e9;
}
</style>
