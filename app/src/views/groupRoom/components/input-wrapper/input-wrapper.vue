<!--
 * @Author: hua
 * @Date: 2019-08-15 21:16:40
 * @description: 输入框页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:34:24
 -->
<template>
    <div class="input_wrapper">
      <div class="voice" @click="handleRecordShow">
        <yd-icon slot="icon" name="uniE906" custom></yd-icon>
      </div>
      <!-- 语音输入 -->
      <div :class="touched? 'record touched':'record'" v-show="recordShow" @touchstart="startRecord" @touchend="stopRecord">按住说话</div>
      <!-- 输入栏 -->
      <vEditDiv v-show="!recordShow" @onFocus="onFocus" @onBlur="onBlur" @click.native="closeDefIconsShow" class="input"  id="edit" placeholder="请输入文字"  v-model="innerText"></vEditDiv>
      <div class="def" @click="handleIconsShow">
        <yd-icon slot="icon" name="uniE905" custom></yd-icon>
      </div>
      <div class="def" style="padding-left:0px;" @click="handleDefsShow" v-show="!sendShow">
        <yd-icon slot="icon" name="jia2" custom></yd-icon>
      </div>
      <div class="def" style="padding-left:0px;" v-show="sendShow">
        <yd-button  @click.native="sendMsg"  type="disabled" size="small" bgcolor="#00C2E6" color="#fff" >发送</yd-button>
      </div>
      <!-- 隐藏的输入框 -->
      <input  name="img" style="display:none;" id="img" type="file" accept="image/*" @change="handleImgOnChange($event)"/>
      <input name="file" style="display:none;" id="file" type="file" @change="handleFileOnChange($event)"/>
    </div>
</template>
<script>
import {Confirm,Alert,Toast,Notify,Loading} from "vue-ydui/dist/lib.rem/dialog";
import vEditDiv from "@/components/v-edit-div/v-edit-div";
export default {
    components: {
        vEditDiv
    },
    props:{
        recordShow:{
            type:Boolean,
            default:true
        },
        content:{
            type:String,
            default:''
        },
        sendShow:{
            type:Boolean,
            default:true
        },
        touched:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            isLocked: false,
            innerText:''
        }
    },
    watch: {
        'content'(){
            if ( !this.isLocked ) {
                this.innerText = this.content;
            }
        },
        'innerText'(){
            if ( !this.isLocked ) {
                this.$emit('handleContent', this.innerText)
            }
        }
    },
    methods:{
        onFocus(){
            this.$emit('onFocus');
        },
        onBlur(){
            this.$emit('onBlur');
        },
        handleRecordShow(){
            this.$emit('handleRecordShow', '')
        },
        // 录音开始
        startRecord() {
          this.$emit('handleStartRecord','')

        },
        // 录音结束
        stopRecord() {
            this.$emit('handleRecordShow', false)
            //window.r.stop();
        },
        closeDefIconsShow(){
            this.$emit('closeDefIconsShow', '')
        },
        handleIconsShow(){
            this.$emit('handleIconsShow', '')
        },
        handleDefsShow(){
            this.$emit('handleDefsShow', '')
        },
        sendMsg(){
            this.$emit('sendMsg', '')
        },
        handleImgOnChange(){
            this.$emit('handleImgOnChange',event)
        },
        handleFileOnChange(){
            this.$emit('handleFileOnChange',event)
        }
    }
}
</script>
<style>
.input_wrapper {
    width: 100%;
    display:flex;
    bottom: 0rem;
    flex-wrap:row;
    justify-content:space-between;
    position:fixed;
    max-width: 750px;
    min-width: 300px;
}

.voice {
    display: flex;
    flex-direction: column-reverse;
    padding: 0.2rem;
    vertical-align: middle;
}

.input {
    /* width: 61%; */
    max-height: 100px;
    line-height: 0.6rem;
    font-size: 20px;
    /* padding: 5px 8px; */
    border-bottom: 1px solid #00C2E6;
    overflow-x: auto;
    /* margin-bottom: 5px; */
    /* vertical-align: middle; */
    /* height: 0.6rem!important; */
    padding: 0rem 0.2rem 0rem 0.2rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
}

.input:empty::before {
    content: attr(placeholder);
}

.recording{
    position:absolute; 
    top:40%;
    width:50%;
    margin-left:25%;
}
.record {
    width: 100%;
    max-height: 100px;
    font-size: 20px;
    border: 1px solid #999999;
    border-radius: 5px;
    text-align: center;
    padding: 0rem 0.2rem 0rem 0.2rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    line-height: 0.6rem;
}

.touched {
    background: #999999;
    color: #fff;
}

.def {
    display: flex;
    flex-direction: column-reverse;
    text-align: center;
    padding: 0.2rem;
    vertical-align: middle;
}

</style>