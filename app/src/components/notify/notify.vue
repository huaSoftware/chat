<!--
 * @Author: hua
 * @Date: 2019-10-12 17:11:53
 * @description: 通知栏
 * @LastEditors: hua
 * @LastEditTime: 2020-03-19 15:30:58
 -->
<template>
  <div class="notify_wrapper bounceInRight animated" v-if="msg" @click="cleanMsg">
      <div class="content">{{JSON.parse(msg.msg)['selfUser']['nick_name']}}@您</div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
export default {
  props: {},
  data: function() {
    return {
     
    };
  },
  mounted(){
  },
  methods:{
    cleanMsg(){
        this.$store.dispatch('updateMsg', "")
    }
  },
  computed: {
    ...mapGetters([
      "msg"
    ]),
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
.notify_wrapper{
    border-radius:0.4rem;
    background:#45BAF4 !important;
    position: fixed;
    z-index:2;
    top:1rem;
    right:0.2rem;
    .content{
        line-height: 0.6rem;
        padding:0.1rem 0.2rem 0.1rem 0.2rem;
        color:#fff;
    }
}
</style>
