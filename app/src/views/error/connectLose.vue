<!--
 * @Author: hua
 * @Date: 2019-12-30 09:40:10
 * @description: 错误页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:15:50
 -->
<template>
<!-- 参数空时页面 -->
<div class="connectLose">
    <span class="icon-custom-404"></span>
    <span class="connectLose_text">{{text}}</span>
    <div @click="handleReset" class="try_reset">重启尝试连接服务器</div>
</div>
</template>

<script>
export default {
    data(){
        return {
            text:""
        }
    },
    created(){
        this.text = this.$route.query.text
    },
    methods:{
        handleReset(){
            window.location.reload()
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';

/* 页面为空时 */
.connectLose {
    width: 100%;
	height: 100%;
	z-index:2;
	position: relative;
}
.icon-custom-404{
	font-size: 4rem;
	position: relative;
	display: block;
	text-align: center;
	padding-top:50%;
}
.icon-custom-404:before {
	color:#aaaaaa;
}
.connectLose_text{
	width:100%;
	display: block;
	text-align: center;
	color:#aaaaaa;
	font-size: 0.46rem;
	margin-top:0.2rem;
}
.try_reset{
    text-align: center;
    width:100%;
    color:$color-primary !important;
    font-size: 0.3rem;
    margin-top:0.2rem;
}
</style>