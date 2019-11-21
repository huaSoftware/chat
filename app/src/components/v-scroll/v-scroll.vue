/* 使用方法
    <vScroll ref="vScroll" @downEvent="handleDown" @upEvent="handleUp" style="height:300px;">
		<ul>
			<li v-for="(key,index) in list">
				{{key.value}}
			</li>
		</ul>
	</vScroll>
    this.$refs.vScroll.handleUpEnd() //结束
	this.$refs.vScroll.handleReset() //重置
    downEvent//下拉事件
    upEvent//上拉事件
 */
<template>
    <div  class="v-scroll-wapper" >
		<div class="v-scroll"  @touchmove="handleScroll" @touchstart="handleStart" @touchend="handleEnd" >
            <div class="v-scroll-top" v-html="downText"></div>
            <slot></slot>
            <div class="v-scroll-bottom" v-html="upText"></div>
        </div>
	</div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            //移动距离
            moveDistance: 0,
            //移动开始时间
            moveStart: 0,
            moving: 0,
            //DOM
            vScroll: null,
            //上拉结束
            upEnd: false,
            //上拉文字变化延迟时间
            upText: '',
            downText: '下拉即可加载',
            downLock: false
        }
    },
    props: {
        //底部提示语
        formatUpText: {
            type: String,
            default: ''
        },
        //顶部提示语
        formatDownText:  {
            type: String,
            default: '正在刷新中...'
        },
        formatDownEndText: {
            type: String,
            default: '下拉即可加载'
        },
        //没有更多提示语
        formatUpText: {
            type: String,
            default: '下拉即可加载'
        },
        formatUpEndText:   {
            type: String,
            default: '没有更多东西了'
        }
    },
    mounted(){
        this.vScroll = document.getElementsByClassName('v-scroll')[0]
    },
    destroyed(){
        
    },
    methods: {
        //
        handletDownCallBack(){
            this.downLock = false
            this.downText = this.formatDownEndText
        },
        //重置处理
        handleReset(){
            this.upLock = false
            console.log('重置上拉')
            return true
        },
        //上拉结束处理
        handleUpCallBack(bool) {
            if(bool){
                this.upLock = true
                console.log('没有更多东西了')
                this.upText = this.formatUpEndText
            }else{
                this.upLock = false
                console.log('下拉加载更多')
                this.upText = this.formatUpText
            }
        },
        //保存离开位置
        handleEnd(event){
            this.moveDistance = this.moveDistance - (this.moveStart - this.moving)
            if(this.moveDistance > 0 ){
                this.vScroll.style.cssText = `transition:1s cubic-bezier(.1, .57, .1, 1); 
                -webkit-transition: 1s cubic-bezier(.1, .57, .1, 1);  
                -webkit-transform: translate(0px,0px) translateZ(0px);`
                this.moveDistance = 0
                if(!this.downLock){
                    console.log('触发下拉刷新')
                    this.downLock = true
                    this.downText = this.formatDownText
                    this.$emit('downEvent')
                }else{
                    console.log('正在刷新中，已被锁定')
                }
                //http://www.cnblogs.com/suanmei/p/9668595.html
            }
            //获取父元素高度并计算下拉加载距离
            let downDistance = -(-this.vScroll.parentElement.offsetHeight + this.vScroll.offsetHeight)
            if(downDistance > this.moveDistance){
                this.vScroll.style.cssText = `transition:1s cubic-bezier(.1, .57, .1, 1); 
                -webkit-transition: 1s cubic-bezier(.1, .57, .1, 1);  
                -webkit-transform: translate(0px,${downDistance}px) translateZ(0px);`
                this.moveDistance = downDistance
                if(!this.upLock){
                    console.log('触发上拉加载')
                    this.upLock = true
                    this.upText = this.formatUpText
                    this.$emit('upEvent')
                }
            }
        },
        //记录开始位置y
        handleStart(event){
            this.moveStart = event.touches[0].pageY
        },
        //记录移动位置y	
        handleScroll(event){
            this.moving = event.touches[0].pageY
            let distance =  this.moveDistance - (this.moveStart - this.moving)
            console.log(distance)
            if(distance >= 70) {
                setTimeout(()=>{//延迟300ms保证流畅
                    if(distance >= 70) {
                        this.vScroll.style.cssText = `transition:1s cubic-bezier(.1, .57, .1, 1); 
                        -webkit-transition: 1s cubic-bezier(.1, .57, .1, 1);  
                        -webkit-transform: translate(0px,0px) translateZ(0px);`
                        this.moveDistance = 0
                    }
                },300)
            }else if( distance <= -70){
                 setTimeout(()=>{//延迟300ms保证流畅
                    if(distance <= -70) {
                        let botDistance = this.vScroll.parentElement.offsetHeight-this.vScroll.offsetHeight
                        this.vScroll.style.cssText = `transition:1s cubic-bezier(.1, .57, .1, 1); 
                        -webkit-transition: 1s cubic-bezier(.1, .57, .1, 1);  
                        -webkit-transform: translate(0px,${botDistance}px) translateZ(0px);`
                        this.moveDistance = botDistance
                    }
                },300)
            }
            else{
                this.vScroll.style.transform = `translate3d(0px, ${distance}px, 0px) translateZ(0px)`
            }
            event.preventDefault()
        }
    }

}
</script>
<style scoped>
.v-scroll-wapper{
    overflow:hidden;
}
.v-scroll{
	width:100%;
	background:#fff;
    transition-duration: 0ms;
}
.v-scroll-top{
    width: 100%;
    text-align: center;
}
.v-scroll-bottom{
    width: 100%;
    text-align: center;
}
</style>
