<!--
 * @Author: hua
 * @Date: 2019-07-10 10:50:03
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-07-14 10:26:12
 -->
<template>
    <div class="room_details">
        <!-- 利用v-if…v-else切换 展开 和 收起 两个画面，template包裹多个元素 -->
        <template v-if="isHide">
            <!-- 只显示摘要的画面 -->
            <div class="hideBg" >
                <p class="summary">
                    <ul class="user_header_wrapper">
                        <li v-for="(item, index) in list" :key="index">
                            <vImg :imgUrl="item.users.head_img"></vImg>
                            <span>{{item.users.nick_name}}</span>
                        </li>
                    </ul>
            </p>
            <div class="showBtn">
                <!-- 绑定点击事件onShow，点击展开全文 -->
                <a href="#" @click.stop.prevent="onShow">
                展开查看全部&nbsp;
                <!-- 向下的角箭头符号，用css画 -->
                <span class="downArrow"></span>
                </a>
            </div>
            </div>
        </template>
        <template v-else>
            <!-- 显示完整内容的画面 -->
            <div class="showBg">
            <p>
                <ul class="user_header_wrapper">
                        <li v-for="(item, index) in list" :key="index">
                            <vImg :imgUrl="item.users.head_img"></vImg>
                            <span>{{item.users.nick_name}}</span>
                        </li>
                    </ul>
            </p>
            <div class="hideBtn">
                <!-- 绑定点击事件onHide，点击收起内容 -->
                <a href="#" @click.stop.prevent="onHide">
                收起&nbsp;
                <!-- 向上的角箭头符号 -->
                <span class="upArrow"></span>
                </a>
            </div>
            </div>
        </template>
        <!-- 房间名称 -->
        <yd-cell-item style="background: #fff;" >
            <span slot="left" style="font-weight: bold">房间名称</span>
            <span slot="right">{{currentRoomName}}</span>
        </yd-cell-item>
        <!--新消息提醒-->
        <yd-cell-item style="background: #fff;">
            <span slot="left" style="font-weight: bold">新消息提醒</span>
            <span slot="right">
                <yd-switch v-model="alert">
                </yd-switch>
            </span>
        </yd-cell-item>
        <CrossLine></CrossLine>
        <!--聊天历史记录-->
        <yd-cell-item style="background: #fff;" @click.native="$router.push({name: 'roomMsgList'})">
            <span slot="left" style="font-weight: bold">聊天历史记录</span>
            <span slot="right">
                <span class="icon-custom-you icon-right"></span>
            </span>
        </yd-cell-item>
        <CrossLine></CrossLine>
        <!--清空聊天历史记录-->
        <yd-button size="large" type="hollow" @click.native="handleDelRoomMsg">清空聊天历史记录</yd-button>
    </div>
</template>
<script>
import { mapGetters, mapMutations} from "vuex";
import storage from "@/utils/localstorage"
import vImg from '@/components/v-img/v-img'
import {joinChatSend} from '@/socketIoApi/chat'
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import {delRoomMsg} from '@/utils/indexedDB'
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
import {userRoomRelationGetByRoomUuid, userRoomRelationUpdateAlert} from '@/api/userRoomRelation'
export default {
    data() {
        return {
            isHide: true, //初始值为true，显示为折叠画面
            alert: true,
            list:[],
            room:{
            }
        };
    },
    components: {vImg, CrossLine},
    computed: {
        ...mapGetters([
            "currentRoomUuid",
            "currentRoomName",
            "currentRoomType"
            ])
    },
    created() {
        this.init()
    },
    mounted() {
    },
    methods: {
        init(){
            userRoomRelationGetByRoomUuid({room_uuid: this.currentRoomUuid}).then(res=>{
                this.list = res.data.list
                this.room = res.data.room.room
                if(res.data.room.is_alert){
                    this.alert = true
                }else{
                    this.alert = false
                }
            })
        },
        onShow: function() {
            this.isHide = false; //点击onShow切换为false，显示为展开画面
        },
        onHide: function() {
            this.isHide = true; //点击onHide切换为true，显示为折叠画面
        },
        handleDelRoomMsg(){
            delRoomMsg(this.currentRoomUuid).then(res=>{
                Toast({'mes':'删除成功'})
            })
        }
    },
    destroyed(){
    },
    beforeRouteLeave(to, from, next) {
        if(to.name == 'room'){
            joinChatSend({
                name: this.currentRoomName,
                room_uuid: this.currentRoomUuid,
                type: this.currentRoomType
            })
        }
        next()
    },
    watch:{
        alert:{
            handler(){
                userRoomRelationUpdateAlert({is_alert: this.alert, room_uuid: this.currentRoomUuid})
                
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import './scss/details.scss';
</style>
