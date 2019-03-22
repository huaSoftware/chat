
<template>
    <div class="content">
        <div class="header_wrapper">
            <img class="header_img" src="//img1.shikee.com/try/2016/06/23/14381920926024616259.jpg">
            <div class="header_name">
                PYTHON软工
            </div>
            <div class="header_id">
                账号：PYTHON软工
            </div>
            <span class="icon-custom-you icon_right"></span>
        </div>
        <CrossLine ></CrossLine>
        <!-- 功能区 -->
        <CrossItem name="新的朋友"  @click.native="$router.push({name: 'newFriend'})">
            <span class="icon-custom-jia font18 icon_style"></span>
        </CrossItem>
        <CrossItem name="收藏" :borderBot="false">
            <span class="icon-custom-guanzhu2 font18 icon_style"></span>
        </CrossItem>
        <CrossLine ></CrossLine>
        <CrossItem name="设置" :borderBot="false" @click.native="$router.push({name: 'mySet'})">
            <span class="icon-custom-shezhi2 font18 icon_style"></span>
        </CrossItem>
        <CrossLine ></CrossLine>
        <yd-button size="large" bgcolor="#ffffff" color="#000000" @click.native="handleExit">退出登录</yd-button>
    </div>
</template>
<script>
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import { mapGetters} from 'vuex'

export default {
    components: {CrossLine, CrossItem},
    data() {
        return {
        }
    },
    methods: {
        handleExit(){
                window.localStorage.clear();
                this.$store.commit('SET_TOKEN', '')
                setTimeout(() => {
                    this.$router.push({ name: "authLogin" });
                }, 100);
            },
    },
    created() {

    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
.header_wrapper{
    background:#fff;
    width:100%;
    height:2.5rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}
.header_img{
    width:1.5rem;
    height:1.5rem;
    position: absolute;
    left: 0.3rem;
    margin-top:0.3rem;
}
.header_name{
    margin-left:2.3rem;
    margin-top:0.3rem;
    font-weight: bold;
    font-size:0.4rem;
}
.header_id{
    margin-left:2.3rem;
    margin-top:0.3rem;
}
.icon_style{
    display: inline-block;
    line-height: 1rem;
}
.icon_right{
    font-weight:bold;
    font-size:0.5rem;
    float:right;
    line-height:1rem;
    color:#aaaaaa;
    position: absolute;
    margin-top: 0.8rem;
    right:0.2rem;
}
</style>