<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 我的页面
 * @LastEditors: hua
 * @LastEditTime: 2020-08-29 23:21:22
 -->

<template>
    <div class="content">
        <div class="header_wrapper">
            <vImg class="header_img" :imgUrl="userInfo.head_img" />
            <div class="header_name">
                {{userInfo.nick_name}}
                <yd-badge v-if="item.type === 1" type="primary">管理</yd-badge>
                <yd-badge v-if="item.type === 2" type="danger">群主</yd-badge>
                <yd-badge v-if="item.type === 0">群员</yd-badge>
            </div>
            <div class="header_id">
                账号：{{userInfo.email}}
            </div>
            <!-- <span class="icon-custom-you icon_right"></span> -->
        </div>
        <CrossLine  v-if="selfItem.type === 2&&item.type !==2"></CrossLine>
        <!-- 功能区 -->
        <!-- <CrossItem name="收藏" :borderBot="false">
            <span class="icon-custom-guanzhu2 font18 icon_style"></span>
        </CrossItem> -->
        <CrossItem v-if="selfItem.type === 2 &&item.type !==2" name="管理员" :borderBot="false" @click.native="handlePermission">
            <span class="icon-custom-hrrenshirenshiguanli380 font18 icon_style"></span>
        </CrossItem>
        <CrossLine v-if="item.status ===0&&(selfItem.type === 2 || selfItem.type === 1)"></CrossLine>
        <CrossItem v-if="item.status ===0&&(selfItem.type === 2 || selfItem.type === 1)" name="禁言" :borderBot="false" @click.native="handleBlock">
            <span class="icon-custom-cha font18 icon_style"></span>
        </CrossItem>
         <CrossLine v-if="item.status ===1&&(selfItem.type === 2 || selfItem.type === 1)"></CrossLine>
        <CrossItem v-if="item.status ===1&&(selfItem.type === 2 || selfItem.type === 1)" name="解禁" :borderBot="false" @click.native="handleUnBlock">
            <span class="icon-custom-smile-01 font18 icon_style"></span>
        </CrossItem>
        <CrossLine v-if="(selfItem.type === 2 || selfItem.type === 1) &&item.type !==2"></CrossLine>
        <CrossItem v-if="(selfItem.type === 2 || selfItem.type === 1) &&item.type !==2" name="删除" :borderBot="false" @click.native="handleDel">
            <span class="icon-custom-icon-custom-- font18 icon_style"></span>
        </CrossItem>
        <CrossLine v-if="selfItem.type === 2 || selfItem.type === 1"></CrossLine>
    </div>
</template>
<script>
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import vImg from '@/components/v-img/v-img'
import { mapGetters} from 'vuex'
import {Alert, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { userInfo } from '@/socketioApi/user'
import {userRoomRelationByUserId,deleteGroupByUserId,activeGroupByUserId,blockGroupByUserId,addManage} from "@/socketioApi/userRoomRelation";

export default {
    components: {CrossLine, CrossItem, vImg},
    data() {
        return {
            userInfo:{

            },
            localRoomId:"",
            item:{},
            selfItem:{}
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
           /*  userInfo().then(res=>{
                console.log(res)
                this.userInfo = res.data
                this.$store.commit('updateUserInfo', res.data)
            }) */
            if(typeof this.$route.query.item !== "undefined"){
                this.userInfo = this.$route.query.item.users;
                this.localRoomId = this.$route.query.item.room_uuid;
                this.item =  this.$route.query.item;
                this.getData()
            }
        },
        getData(){
            userRoomRelationByUserId({room_uuid:this.localRoomId}).then(res=>{
                console.log(res)
                this.selfItem = res.data;
            })
        },
        handlePermission(){
            addManage({room_uuid:this.localRoomId, user_id:this.userInfo.id}).then(res=>{
                Toast({'mes':'提权成功'})
                this.$router.go(-1)
            })
        },
        handleBlock(){
            blockGroupByUserId({room_uuid:this.localRoomId, user_id:this.userInfo.id}).then(res=>{
                Toast({'mes':'禁言成功'})
                this.$router.go(-1)
               
            })
        },
        handleUnBlock(){
            activeGroupByUserId({room_uuid:this.localRoomId, user_id:this.userInfo.id}).then(res=>{
                Toast({'mes':'解禁成功'})
                this.$router.go(-1)
            })
        },
        handleDel(){
            deleteGroupByUserId({room_uuid:this.localRoomId, user_id:this.userInfo.id}).then(res=>{
                Toast({'mes':'删除成功'})
                this.$router.go(-1)
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