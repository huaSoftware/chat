<!-- 我的收藏/我的足迹... 组件 -->

<template>
  <div class="cross-item" :style="borderBot?'border-bottom: 1px solid #E4E4E4':''">
    <!-- 实心图标 -->
    <span class="ico" v-if="isIcon"><slot></slot></span>
    <span class="name">{{name}}</span><span class="icon-custom-you icon-right"></span>
    <span><slot name="badge"></slot> </span>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    name: {
      type: String,
      default: '我的'
    },
    borderBot:{
      type: Boolean,
      default: true
    },
    isIcon:{
      type: Boolean,
      default: true
    }
  },
  watch: {},
  methods: {},
  filters: {},
  computed: {},
  created () {},
  mounted () {}
}
</script>

<style lang="scss" scoped>


.cross-item {
  overflow:hidden;
  color: #333;
  height:1rem;
  line-height:1rem;
  background: #fff;
 /*  margin: 0 10px 0 10px; */
  padding: 0 0.2rem;
  .ico {
    display: inline-block;
    width: 0.6rem;
    i {
      font-size: 0.4rem;
      color: #fe970f;
    }
  }
  .name {
    font-size:0.3rem;
  }
}
.icon-right{
  font-weight:bold;
  font-size:0.5rem;
  float:right;
  line-height:1rem;
  color:#aaaaaa;
}
</style>
