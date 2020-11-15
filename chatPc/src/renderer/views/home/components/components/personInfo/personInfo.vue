<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 我的页面
 * @LastEditors: hua
 * @LastEditTime: 2020-11-15 14:44:09
 -->

<template>
    <div class="content">
        <div class="header_wrapper">
            <vImg class="header_img" :imgUrl="userInfo.head_img" />
            <div class="header_name">
                {{userInfo.name}}
            </div>
            <div class="header_id">
                账号： <el-button v-if="selfItem.type === 1" type="primary" size="mini">管理</el-button>
                <el-button v-if="selfItem.type === 2" type="primary" size="mini">群主</el-button>
                <el-button v-if="selfItem.type === 0" type="primary" size="mini">群员</el-button>
            </div>
            <!-- <span class="icon-custom-you icon_right"></span> -->
        </div>
        <div style="margin-top:20px"></div>
        <!-- 功能区 -->
        <!-- <CrossItem name="收藏" :borderBot="false">
            <span class="icon-custom-guanzhu2 font18 icon_style"></span>
        </CrossItem> -->
        <div class="item" v-if="selfItem.type === 2 &&selfItem.type !==2" @click="handlePermission">
            管理员
        </div>
        <div v-if="selfItem.status ===0&&(selfItem.type === 2 || selfItem.type === 1)"></div>
        <div class="item" v-if="selfItem.type === 2 || selfItem.type === 1" @click="handleBlock">
            禁言
        </div>
         <div v-if="selfItem.type === 2 || selfItem.type === 1"></div>
        <div class="item" v-if="selfItem.type === 2 || selfItem.type === 1" @click="handleUnBlock">
            解禁
        </div>
        <div v-if="selfItem.type === 2 || selfItem.type === 1"></div>
        <div class="item" v-if="selfItem.type === 2 || selfItem.type === 1" @click="handleDel">
            删除
        </div>
        <div v-if="selfItem.type === 2 || selfItem.type === 1"></div>
    </div>
</template>
<script>
import vImg from '@/components/v-img'
import { mapGetters} from 'vuex'
import { MessageBox, Message } from "element-ui";
import { userInfo } from '@/socketioApi/user'
import {userRoomRelationByUserId,deleteGroupByUserId,activeGroupByUserId,blockGroupByUserId,addManage} from "@/socketioApi/userRoomRelation";

export default {
    components: { vImg},
    data() {
        return {
            selfItem:{}
        }
    },
     props:{
        userInfo: {
            type: Object,
            default () {
                return { 
                }
            }
        },
        localRoomId:{
            type: String,
            default: ""
        },
    },
    computed: {
        ...mapGetters([
        "newFriendAlertNumber",
        ])
    },
    methods: {
        getData(){
            userRoomRelationByUserId({room_uuid:this.localRoomId}).then(res=>{
                console.log(res)
                this.selfItem = res.data;
            })
        },
        handlePermission(){
            addManage({room_uuid:this.localRoomId, user_id:this.userInfo.user_id}).then(res=>{
                Message({
                    message: "提权成功",
                    type: "success",
                    duration: 5 * 1000,
                });
                this.$emit('handleClose')
            })
        },
        handleBlock(){
            blockGroupByUserId({room_uuid:this.localRoomId, user_id:this.userInfo.user_id}).then(res=>{
                Message({
                    message: "禁言成功",
                    type: "success",
                    duration: 5 * 1000,
                });
                this.$emit('handleClose')
               
            })
        },
        handleUnBlock(){
            activeGroupByUserId({room_uuid:this.localRoomId, user_id:this.userInfo.user_id}).then(res=>{
                Message({
                    message: "解禁成功",
                    type: "success",
                    duration: 5 * 1000,
                });
                this.$emit('handleClose')
            })
        },
        handleDel(){
            deleteGroupByUserId({room_uuid:this.localRoomId, user_id:this.userInfo.user_id}).then(res=>{
                 Message({
                    message: "删除成功",
                    type: "success",
                    duration: 5 * 1000,
                });
                this.$emit('handleClose')
            })
        }
    },
    created() {
        this.getData()
    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
.header_wrapper{
    background:#fff;
    width:100%;
    height:50px;
    display: flex;
    flex-direction: column;
}
.header_img{
    width:50px;
    height:50px;
    position: absolute;
    margin-top:6px;
}
.header_name{
    margin-left:56px;
    margin-top:10px;
    font-weight: bold;
}
.header_id{
    margin-left:56px;
    margin-top:0px;
    line-height: 28px;
    height: 28px;
}
.icon_style{
    display: inline-block;
    line-height: 20px;
}
.icon_right{
    font-weight:bold;
    font-size:12px;
    float:right;
    line-height:20px;
    color:#aaaaaa;
    position: absolute;
    margin-top: 16px;
    right:4px;
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
.item:hover{
  background-color: #ecf5ff;
}
</style>