<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 我的页面
 * @LastEditors  : hua
 * @LastEditTime : 2019-12-30 15:28:38
 -->

<template>
    <div class="content">
        <div class="header_wrapper">
            <vImg class="header_img" :imgUrl="userInfo.head_img" />
            <div class="header_name">
                {{userInfo.nick_name}}
            </div>
            <div class="header_id">
                账号：{{userInfo.email}}
            </div>
            <!-- <span class="icon-custom-you icon_right"></span> -->
        </div>
        <CrossLine ></CrossLine>
        <!-- 功能区 -->
        <CrossItem name="添加好友记录"  @click.native="$router.push({name: 'newFriend'})">
            <yd-badge   type="danger" v-if="newFriendAlertNumber > 0">{{newFriendAlertNumber}}</yd-badge>
            <span class="icon-custom-jia font18 icon_style" v-else></span>
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
import vImg from '@/components/v-img/v-img'
import { mapGetters} from 'vuex'
import { userInfo } from '@/socketioApi/user'

export default {
    components: {CrossLine, CrossItem, vImg},
    data() {
        return {
            userInfo:{

            }
        }
    },
    computed: {
        ...mapGetters([
        "newFriendAlertNumber"
        ])
    },
    methods: {
        init(){
            window.physicsBackRouter = null
            userInfo().then(res=>{
                console.log(res)
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