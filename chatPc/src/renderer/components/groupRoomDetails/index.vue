<!--
 * @Author: hua
 * @Date: 2019-07-10 10:50:03
 * @description: 房间详情
 * @LastEditors: hua
 * @LastEditTime: 2020-11-13 21:37:42
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
                            <li  style="width:25%;text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;"v-for="(item, index) in list" :key="index">
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
                            <li style="width:25%;text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;" v-for="(item, index) in list" :key="index" @click="handleGoPersonInfo(item)">
                                <vImg :imgUrl="item.users.head_img"></vImg>
                                <span>{{item.users.nick_name}}</span>
                            </li>
                            <li style="width:25%" @click="handleAddCustomer">
                                <div style="font-size: 0.8rem;margin-top:0.3rem" class="icon-custom-jia"></div>
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
            <div class="item" style="margin-top:10px">
                <span class="left" style="font-weight: bold">房间名称</span>
                <span class="right">{{currentRoomName}}</span>
            </div>
            <!--新消息提醒-->
             <div class="item">
                <span class="left" style="font-weight: bold">新的消息提醒</span>
                <span class="right">
                    <el-switch
                        v-model="alert"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </span>
            </div>
            <!-- 聊天数据离线保存 -->
            <div class="item">
                <span class="left" style="font-weight: bold">聊天云端保存</span>
                <span class="right">
                    <el-switch
                        v-model="save_action"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </span>
            </div>
            <!--聊天历史记录-->

             <div class="item" @click="$router.push({name: 'roomMsgList'})">
                <span style="font-weight: bold">聊天历史记录</span>
            </div>
            <!--清空聊天历史记录-->
            <div class="item" @click="handleDelRoomMsg">
                <span class="left" style="font-weight: bold">清空聊天历史记录</span>
            </div>
            <!--删除并退出-->
            <div class="btn-center">
              <el-button type="success" class="send-btn" @click="handleDelRoom">删除并退出</el-button>
            </div>
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
import { MessageBox, Message } from "element-ui";
import storage from "@/utils/localstorage"
import vImg from '@/components/v-img'
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
            list:[],
        };
    },
    components: {vImg},
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
            console.log("333333",this.currentRoomUuid)
            userRoomRelationGetByRoomUuid({room_uuid: this.currentRoomUuid}).then(res=>{
                console.log(res)
                if(!res.data.room){
                    this.status = false;
                    return;
                }
                this.list = res.data.list.reverse()

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
        handleGoPersonInfo(item){
            console.log(item)
            this.$router.push({name:'personInfo',query:{item}})
        },
        handleDelRoom(){
            MessageBox.confirm(`删除房间，确认删除？`, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
                roomDel({room_uuid:this.currentRoomUuid}).then(res=>{
                    Message({
                        message:`删除并退出成功`,
                        type: "success",
                        duration: 5 * 1000,
                    });
                    this.$router.push({name:'Home'})
                }) 
            });
        },
        handleDelRoomMsg(){
             MessageBox.confirm(`只能删除本地记录，确认删除？`, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
                if(this.currentRoomSaveAction == 0){
                    delRoomMsg(this.currentRoomUuid).then(res=>{
                        Message({
                            message:`删除成功`,
                            type: "success",
                            duration: 5 * 1000,
                        });
                    })
                }
            });
        },
        handleAddCustomer(){
            this.$router.push({ name: "groupChat",query:{ room_uuid: this.currentRoomUuid,room_name:this.currentRoomName} });
        }
    },
    destroyed(){
    },
    beforeRouteLeave(to, from, next) {
        if(to.name == 'groupRoom'){
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
.user_header_wrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    text-align: center;
    flex-wrap: wrap;
    width:100%;
}
.user_header_wrapper li{
    list-style: none;
    display: flex;
    flex-direction: column;
    padding:10px;
}
.user_header_wrapper li img{
    width:40px;
    height: 40px
}
.user_header_wrapper li span{
    font-size:16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
}

/* 折叠 */
.hideBg {
    width: 100%;
    background-color: #e9ecef;
    padding-bottom: 0;    /* 方便渐变层遮挡 */
    position: relative;    /* 用于子元素定位 */
}
/* 全文背景板，基本与摘要相同 */
.showBg {
    width: 100%;
    background-color: #e9ecef;
}
/* 摘要内容 */
.summary {
    overflow: hidden;    /* 隐藏溢出内容 */
    text-overflow: clip;    /* 修剪文本 */
    display: -webkit-box;    /* 弹性布局 */
    -webkit-box-orient: vertical;    /* 从上向下垂直排列子元素 */
    -webkit-line-clamp: 3;    /* 限制文本仅显示前三行 */
}
#example p {
    text-indent: 2em;
}
/* 展开按钮 */
.showBtn {
    width: 100%;    /* 与背景宽度一致 */
    height: 80px;
 
    z-index: 0;    /* 正序堆叠，覆盖在p元素上方 */
    text-align: center;
    background: linear-gradient(rgba(233,236,239,.5), white);    /* 背景色半透明到白色的渐变层 */
    padding-top:  4px;
    /* top:3rem; */
}
/* 收起按钮 */
.hideBtn {
    text-align: right;
    padding-right:12px;
    padding-bottom:12px;
}
#example a {
    text-decoration: none;    /* 清除链接默认的下划线 */
}
/* 向下角箭头 */
.downArrow {
    display: inline-block;
    width: 8px;    /* 尺寸不超过字号的一半为宜 */
    height: 8px;
    border-right: 1px solid;    /* 画两条相邻边框 */
    border-bottom: 1px solid;
    transform: rotate(45deg);    /* 顺时针旋转45° */
    margin-bottom: 3px;
}
/* 向上角箭头，原理与下箭头相同 */
.upArrow {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-left: 1px solid;
    border-top: 1px solid;
    transform: rotate(45deg);
    margin-top: 3px;
}
.icon-right{
    font-weight:bold;
    font-size:15px;
    float:right;
    line-height:20px;
    color:#aaaaaa;
}
.send-btn{
  width:150px;
}
.btn-center{
  display: flex;
  justify-content: center;
  margin-top:30px;
}
.item{
  border-bottom: 1px solid rgb(230, 230, 230);
  height:50px;
  line-height:30px;
  padding-top:10px;
  padding-bottom:10px;
  padding-left:10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
}
.right{
    padding-right:12px;
}
.item:hover{
  background-color: #ecf5ff;
}
</style>

