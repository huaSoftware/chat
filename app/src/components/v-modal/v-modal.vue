<!--
 * @Author: hua
 * @Date: 2019-12-13 15:47:27
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-12-14 12:13:48
 -->
<template>
    <div class="modal" data-type="mask" @click="handleClose" v-if="delay_mask_show">
        <!-- 模态框 -->
        <div class="modal_mask">
            <div  key="amache" class="animated bounceIn modal_wrapper" :style="mask_show?'left:50%':'left:-50%'">
                <!-- 标题 -->
                <div class="title">{{title}}</div>
                <!--  图片 -->
                <vImg :src="img_name"/>
                <!-- 状态文字 -->
                <div class="text">{{text}}</div>
                <!-- 描述文字 -->
                <div class="description_text">{{description}}</div>
                <!-- 按钮区域 -->
                <div class="bth_wrapper" :style="type == 'confirm'?'display:flex':'display:none'">
                    <div class="cancel" @click="handleCancel">{{cancel_text}}</div>
                    <div class="confirm" @click="handleConfirm">{{confirm_text}}</div>
                </div>
                <div class="bth_wrapper" :style="type == 'alert'?'display:flex':'display:none'">
                    <div class="alert_confirm" @click="handleConfirm">{{confirm_text}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import vImg from "../v-img/v-img"
export default {
    components:{vImg},
    data(){
        return{
            mask_show: false,
            delay_mask_show:false
        }
    },
    props:{
        //遮罩是否能关闭
        mask_can_close:{
            type:Boolean,
            default:false
        },
        //类型：alert,confirm,loading
        type:  {
            type: String,
            default:"confirm"
        },
        //类型success,fail
        status:{
            type: String,
            default:"success"
        },
        //图片名checking,empty,fail,success
        img_name:{
            type: String,
            default:"success"
        },
        //标题
        title:{
            type: String,
            default:""
        },
        //状态文字
        text:{
            type: String,
            default:"状态文字"
        },
        //描述文字
        description:{
            type: String,
            default:"描述文字"
        },
        //确定按钮
        confirm_text:{
            type: String,
            default:"确定"
        },
        //取消按钮
        cancel_text:{
            type: String,
            default:"取消"
        }
    },
    methods:{
        handleCancel(){
            this.closeMask()
            this.$emit("onCancel")
        },
        handleConfirm(){
            this.$emit("onConfirm")
        },
        handleClose(){
            if(event.target.parentNode.getAttribute('data-type') && this.mask_can_close){
                this.closeMask()
            }
        },
        closeMask(){
            setTimeout(()=>{
                this.delay_mask_show = false
            },500);
            this.mask_show = false
        },
        openMask(){
            setTimeout(()=>{
                this.delay_mask_show = true
            },500);
            this.mask_show = true
        }
    }
}
</script>
<style lang="scss" scoped>
.modal {
    //包装器
    .modal_mask{
        position: fixed;
        z-index:1000;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.5);
        top:0px;
        transition: top 0.5s;
        -moz-transition: top 0.5s;
        -webkit-transition: top 0.5s;
        -o-transition: top 0.5s;
        .modal_wrapper{
            background:#fff;
            width:250px;
            position: relative;
            left:50%;
            /* top:50%; */
            margin-left: -125px;
            margin-top:40%;
            border-radius: 5px;
            transition: left 0.5s;
            -moz-transition: left 0.5s;	
            -webkit-transition: left 0.5s;	
            -o-transition: left 0.5s;
            .title{
                width:100%;
                font-size:20px;
                font-weight: bold;
                text-align: center;
                padding-top:20px;
            }
            img{
                width:120px;
                position: relative;
                left:50%;
                margin:25px 0px 20px -60px;
                height:124px;
            }
            .fail_text{
                width:100%;
                font-size:16px;
                font-weight: bold;
                text-align: center;
            }
            .text{
                width:100%;
                font-size:16px;
                font-weight: bold;
                text-align: center;
            }
            .description_text{
                width:100%;
                font-size:12px;
                text-align: center;
                /* color:@color-text-help; */
                margin-top:10px;
            }
            .bth_wrapper{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 210px;
                margin-left:20px;
                margin-top:20px;
                padding-bottom:30px;
                .confirm{
                    width:100px;
                    height: 32px;
                    line-height: 32px;
                    background: #868686;
                    background:linear-gradient(219deg,rgba(15,199,217,1) 0%,rgba(47,218,136,1) 100%);
                    border-radius:5px;
                    color:#fff;
                    text-align: center;
                }
                .cancel{
                    width:100px;
                    height: 32px;
                    line-height: 32px;
                    background: #868686;
                    border-radius:5px;
                    color:#fff;
                    text-align: center;
                }
                .alert_confirm{
                    margin-left:25px;
                    width:160px;
                    height: 32px;
                    line-height: 32px;
                    background: #868686;
                    background:linear-gradient(219deg,rgba(15,199,217,1) 0%,rgba(47,218,136,1) 100%);
                    border-radius:5px;
                    color:#fff;
                    text-align: center;
                }
            }
        }
    }
}
</style>