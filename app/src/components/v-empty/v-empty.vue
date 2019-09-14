<!--
 * @Author: hua
 * @Date: 2019-08-15 20:19:37
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-08-15 20:30:44
 -->
<template>
    <!-- 参数空时页面 -->
    <div class="empty">
        <span class="icon-custom-xiaoxi"></span>
        <span class="empty_text">暂无消息</span>
    </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {}
  },
  props: {},
  watch: {},
  methods: {},
  filters: {},
  computed: {},
  created () {},
  mounted () {},
  destroyed () {}
}
</script>
<style scoped>

/* 页面为空时 */
.empty {
    width: 100%;
	height: 100%;
	z-index:2;
	position: relative;
}
.icon-custom-xiaoxi{
	font-size: 2rem;
	position: relative;
	display: block;
	text-align: center;
	padding-top:50%;
}
.icon-custom-xiaoxi:before {
	color:#aaaaaa;
}
.empty_text{
	width:100%;
	display: block;
	text-align: center;
	color:#aaaaaa;
	font-size: 0.56rem;
	margin-top:0.2rem;
}
</style>