<!--
 * @Author: hua
 * @Date: 2019-08-15 21:16:40
 * @description: 输入框页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-31 23:01:45
 -->
<template>
    <div class="input-wrapper">
        <div class="input-def">
            <svg-icon @click="handleIconsShow" :icon-class="'smile'" class="icon-wrap"></svg-icon>
            <svg-icon :icon-class="'file'" class="icon-wrap"></svg-icon>
            <svg-icon :icon-class="'image'" class="icon-wrap"></svg-icon>
            <svg-icon :icon-class="'record'" class="icon-wrap"></svg-icon>
            <svg-icon :icon-class="'chat'" class="icon-wrap"></svg-icon>
        </div>
      <!-- <div class="voice" @click="handleRecordShow">
        <i slot="icon" name="uniE906" custom></i>
      </div> -->
      <!-- 语音输入 -->
      <!-- <div :class="touched? 'record touched':'record'" v-show="recordShow" @touchstart="startRecord" @touchend="stopRecord">按住说话</div> -->
      <!-- 输入栏 -->
      <vEditDiv @onEnter="sendMsg" @onFocus="onFocus" @onBlur="onBlur" @click.native="closeDefIconsShow" class="input"  id="edit" placeholder=""  v-model="innerText"></vEditDiv>
     <!--  <div class="def" @click="handleIconsShow">
        <i slot="icon" name="uniE905" custom></i>
      </div>
      <div class="def" style="padding-left:0px;" @click="handleDefsShow" v-show="!sendShow">
        <i slot="icon" name="jia2" custom></i>
      </div>
      <div class="def" style="padding-left:0px;" v-show="sendShow">
        <button  @click.native="sendMsg"  type="disabled" size="small" bgcolor="#00C2E6" color="#fff" >发送</button>
      </div> -->
      <div class="send-btn-wrap">
        <el-button  class="send-btn" type="default" size="mini" @click="sendMsg">发送(S)</el-button>
      </div>
      <!-- 隐藏的输入框 -->
      <input  name="img" style="display:none;" id="img" type="file" accept="image/*" @change="handleImgOnChange($event)"/>
      <input name="file" style="display:none;" id="file" type="file" @change="handleFileOnChange($event)"/>
    </div>
</template>
<script>
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
        onFocus(event){
            this.$emit('onFocus',event);
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
.input-wrapper {
    width: 100%;
    display:flex;
    flex-direction: column;
    position: relative;
    height:140px;
    border-top: solid 1px #e6e6e6;
}

.voice {
    display: flex;
    flex-direction: column-reverse;
    padding: 0.2rem;
    vertical-align: middle;
}

.input {
    /* width: 61%; */
    height: 60px;
    line-height: 16px;
    font-size: 16px;
    /* padding: 5px 8px; */
    /* border-bottom: 1px solid #00C2E6; */
    overflow-x: auto;
    /* margin-bottom: 5px; */
    /* vertical-align: middle; */
    /* height: 0.6rem!important; */
    padding: 0px 20px 0rem 20px;
    margin-top: 0px;
    margin-bottom: 0px;
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
.send-btn-wrap{
    display: flex;
    justify-content: flex-end;
    padding-right:40px;
    margin-top:5px;
}
.send-btn{
    width:70px;
}
.input-def{
    height:40px;
    line-height: 40px;
    padding-left:19px;
}
.icon-wrap{
    font-size: 20px;
    margin-right:15px;
    cursor:pointer;
}
</style>