<template>
<!-- 通用标题,支持点击展开，收起；查看更多 
    example: <vTitle :name="name"  :showMore="true" ></vTitle>
-->
<div class="common_title_wapper">
    <span class="common" :style="nameCenter ? 'text-align:center;width:100%' : 'float:left'">{{name}}</span>
    <span class="common_more_right" v-if="showMore" @click="goHref(routerObj)">
        <span class="common">{{textMore}}
        </span>
        <span :class="iconMore+' common common_more_icon_right'">
        </span>
    </span>
    <span class="common_up_down_right" v-if="showUpDown" @click="showContent()">
        <span class="common">{{contentIsShow ? upDownText.showName : upDownText.hideName}}
        </span>
        <span :class="iconMore+' common common_more_icon_right common_icon_transform'" :style="contentIsShow ? 'transform:rotate(270deg);': ''">
        </span>
    </span>
</div>
</template>
<script>
export default {
data(){
    return{
        contentIsShow: false
    }          
},
props: {
    name: {
        type: String,
        default: '标题名'
    },
    nameCenter:{
        type: Boolean,
        default: false
    },
    showMore: {
        type: Boolean,
        default: false
    },
    textMore: {
        type: String,
        default: '查看更多'
    },
    iconMore: {
        type: String,
        default: 'icon-dddddd'
    },
    routerObj: {
        type: Object,
        default () {
            return { 
                name: "home",
                value: {text: '1'}
            }
        }
    },
    showUpDown: {
        type: Boolean,
        default: false
    },
    upDownText: {
        type: Object,
        default () {
            return { 
                showName: "展开",
                hideName: "收起"
            }
        }
    },
},
methods:{
    goHref(routerObj){
        this.$router.push({
            name: routerObj.name,
            params: {
                value: routerObj.value
            }
        })
    },
    showContent(){
        this.contentIsShow = !this.contentIsShow
    }
}
}
</script>
<style scoped>
.common_title_wapper{
    width:100%;
    height:0.8rem;
    line-height: 0.8rem;
    background:#fff;
    padding: 0px 0.24rem 0px 0.24rem;
    font-size: 0.3rem;
}
.common{
    height:0.8rem;
    line-height:0.8rem;
    display: inline-block;
    vertical-align:middle;
}
.common_more_right{
    float:right;
    height: 0.8rem;
    line-height: 0.8rem; 
}

.common_more_icon_right{
    font-size: 0.32rem;
}
.common_up_down_right{
    float:right;
    height:0.8rem;
    line-height: 0.8rem; 
    min-width:0.8rem;
    text-align: right;
}
.common_icon_transform{
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); 	/* IE 9 */
    -moz-transform:rotate(90deg); 	/* Firefox */
    -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
    -o-transform:rotate(90deg); 	/* Opera */
    transition: transform 1s;
    -moz-transition: transform 1s;	/* Firefox 4 */
    -webkit-transition: transform 1s;	/* Safari 和 Chrome */
    -o-transition: transform 1s;	/* Opera */
}
</style>
    