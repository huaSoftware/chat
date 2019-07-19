<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-06-17 15:10:14
 -->

<template>
    <div class="content">
        <div class="header_wrapper">
            <img class="header_img" :src="userInfo.head_img">
            <div class="header_name">
                {{userInfo.nick_name}}
            </div>
            <div class="header_id">
                账号：{{userInfo.email}}
            </div>
            <span class="icon-custom-you icon_right"></span>
        </div>
        <CrossLine ></CrossLine>
        <!-- 功能区 -->
        <CrossItem name="添加好友记录"  @click.native="$router.push({name: 'newFriend'})">
            <span class="icon-custom-jia font18 icon_style"></span>
        </CrossItem>
        <!-- <CrossItem name="收藏" :borderBot="false">
            <span class="icon-custom-guanzhu2 font18 icon_style"></span>
        </CrossItem> -->
        <CrossLine ></CrossLine>
        <CrossItem name="设置" :borderBot="false" @click.native="$router.push({name: 'mySet'})">
            <span class="icon-custom-shezhi2 font18 icon_style"></span>
        </CrossItem>
        <CrossLine ></CrossLine>
    </div>
</template>
<script>
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import { mapGetters} from 'vuex'
import { userInfo } from '@/api/user'

export default {
    components: {CrossLine, CrossItem},
    data() {
        return {
            userInfo:{

            }
        }
    },
    methods: {
        init(){
            window.physicsBackRouter = null
            userInfo().then(res=>{
                this.userInfo = res.data
                this.$store.commit('updateUserInfo', res.data)
            })
        }
    },
    created() {
        this.init()
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