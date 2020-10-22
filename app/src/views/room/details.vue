<!--
 * @Author: hua
 * @Date: 2019-07-10 10:50:03
 * @description: 房间详情
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:16:46
 -->
<template>
    <div class="room_details" >
        <div v-if="status">
            <!-- 利用v-if…v-else切换 展开 和 收起 两个画面，template包裹多个元素 -->
            <template v-if="isHide">
                <!-- 只显示摘要的画面 -->
                <div class="hideBg" >
                    <div class="summary">
                        <ul class="user_header_wrapper">
                            <li v-for="(item, index) in list" :key="index">
                                <vImg :style="item.users.online?'':'background: grey;opacity: 0.5'" :imgUrl="item.users.head_img"></vImg>
                                <span>{{item.users.nick_name}}</span>
                            </li>
                        </ul>
                    </div>
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
                    <div>
                        <ul class="user_header_wrapper">
                            <li v-for="(item, index) in list" :key="index">
                                <vImg :imgUrl="item.users.head_img"></vImg>
                                <span>{{item.users.nick_name}}</span>
                            </li>
                        </ul>
                    </div>
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
                <span slot="left" style="font-weight: bold">新的消息提醒</span>
                <span slot="right">
                    <yd-switch v-model="alert">
                    </yd-switch>
                </span>
            </yd-cell-item>
            <!-- 聊天数据离线保存 -->
            <yd-cell-item style="background: #fff;">
                <span slot="left" style="font-weight: bold">聊天云端保存</span>
                <span slot="right">
                    <yd-switch v-model="save_action">
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
            <yd-cell-item style="background: #fff;" @click.native="handleDelRoomMsg">
                <span slot="left" style="font-weight: bold">清空聊天历史记录</span>
                <span slot="right">
                </span>
            </yd-cell-item>
            <!--删除并退出-->
            <yd-button size="large" type="hollow" @click.native="handleDelRoom">删除并退出</yd-button>
            <!-- 模态窗 -->
           <!--  <vModal 
                ref="DelRoomRef"
                @onConfirm="handleDelRoom"
                :title="'提示'"
                :text="'删除房间'"
                :description="'删除后聊天记录将清空'"
            >
            </vModal> -->
        </div>
        <div v-else style="    position: absolute;
    font-size: 30px;
    left: 50%;
    margin-left: -30px;
    top: 50%;
    margin-top: -20px;">暂无</div>
    </div>
</template>
<script>
import { mapGetters, mapMutations} from "vuex";
import {Confirm} from "vue-ydui/dist/lib.rem/dialog";
import vModal from '@/components/v-modal/v-modal'
import storage from "@/utils/localstorage"
import vImg from '@/components/v-img/v-img'
import {joinChatSend} from '@/socketIoApi/chat'
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import {delRoomMsg} from '@/utils/indexedDB'
import {roomMsgDel, roomDel} from '@/socketioApi/room'
import {Alert, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import {userRoomRelationGetByRoomUuid, userRoomRelationUpdateAlert, userRoomRelationUpdateSaveAction} from '@/socketioApi/userRoomRelation'
export default {
    data() {
        return {
            status: true,
            isHide: true, //初始值为true，显示为折叠画面
            alert: true,
            save_action:false,
            list:[]
        };
    },
    components: {vImg, vModal, CrossLine},
    computed: {
        ...mapGetters([
            "currentRoomUuid",
            "currentRoomName",
            "currentRoomType",
            "currentRoomSaveAction"
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
                if(!res.data.room){
                    this.status = false;
                    return;
                }
                this.list = res.data.list
                if(res.data.room.is_alert){
                    this.alert = true
                }else{
                    this.alert = false
                }
                if(res.data.room.save_action){
                    this.save_action = true
                }else{
                    this.save_action = false
                }
            })
        },
        onShow: function() {
            this.isHide = false; //点击onShow切换为false，显示为展开画面
        },
        onHide: function() {
            this.isHide = true; //点击onHide切换为true，显示为折叠画面
        },
        /* handleDelRoom(){      
            setTimeout(()=>{
                roomDel({room_uuid:this.currentRoomUuid}).then(res=>{
                    Alert({
                        'mes':'删除并退出成功',
                        callback:()=>{
                            this.$router.push({name:'home'})
                        }
                    })
                }) 
            },500)    
        }, */
        handleDelRoom(){
            Confirm({
                title: '提示',
                mes: '删除房间，确认删除？',
                opts: [
                    {
                        txt: '取消',
                        color: false,
                        callback: () => {
                        }
                    },
                    {
                        txt: '确定',
                        color: true,
                        callback: () => {
                            roomDel({room_uuid:this.currentRoomUuid}).then(res=>{
                                Alert({
                                    'mes':'删除并退出成功',
                                    callback:()=>{
                                        this.$router.push({name:'home'})
                                    }
                                })
                            }) 
                        }
                    }
                ]
            });
        },
        handleDelRoomMsg(){
            Confirm({
                title: '提示',
                mes: '只能删除本地记录，确认删除？',
                opts: [
                    {
                        txt: '取消',
                        color: false,
                        callback: () => {
                        }
                    },
                    {
                        txt: '确定',
                        color: true,
                        callback: () => {
                            if(this.currentRoomSaveAction == 0){
                                delRoomMsg(this.currentRoomUuid).then(res=>{
                                    Toast({'mes':'删除成功'})
                                })
                            }/* else if(this.currentRoomSaveAction == 1){
                                roomMsgDel({room_uuid:this.currentRoomUuid}).then(res=>{
                                    Toast({'mes':'删除成功'})
                                })
                            } */
                        }
                    }
                ]
            });
        }
    },
    destroyed(){
    },
    beforeRouteLeave(to, from, next) {
        if(to.name == 'room'){
            joinChatSend({
                name: this.currentRoomName,
                room_uuid: this.currentRoomUuid,
                type: this.currentRoomType,
                save_action:this.currentRoomSaveAction
            })
        }
        next()
    },
    watch:{
        alert:{
            handler(){
                userRoomRelationUpdateAlert({is_alert: this.alert, room_uuid: this.currentRoomUuid})
            }
        },
        save_action:{
            handler(){
                userRoomRelationUpdateSaveAction({save_action: this.save_action, room_uuid: this.currentRoomUuid}).then(res=>{
                    this.$store.commit('updateCurrentRoomSaveAction',this.save_action)
                })
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import './scss/details.scss';
</style>
