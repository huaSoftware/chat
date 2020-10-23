<!--
 * @Author: hua
 * @Date: 2019-07-18 08:54:06
 * @description: 裁剪页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:35:15
 -->
<template>
   <!-- 裁剪图 -->
    <!-- vueCropper 剪裁图片实现-->
    <div class="vue-cropper-box" >
      <div class="vue-cropper-content">
        <vueCropper
          class="cropper_wrapper"
          ref="cropper"
          :img="reqImgData.imgDatas"
          :outputSize="option.size"
          :outputType="option.outputType"
          :canMoveBox="option.canMoveBox"
          :canMove="option.canMove"
          :autoCrop="true"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
        ></vueCropper>
      </div>
      <!-- 截图功能键 -->
      <div class="btn_wrapper">
        <yd-button
          @click.native="handleOnRawImg"
          type="primary"
          class="raw_img"
        >原图</yd-button>
        <yd-button
          @click.native="handleOnCubeImg"
          type="warning"
          class="cube_img"
        >裁剪</yd-button>
      </div>
    </div> 
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { uploadBase64 } from "@/socketioApi/common";
import { VueCropper } from "vue-cropper";
import { chatSend } from "@/socketioApi/chat";
import {Loading} from "vue-ydui/dist/lib.rem/dialog";
export default {
    data(){
        return {
            option: {
                img: "",
                size: 1,
                outputType: "png",
                canMove: false,
                canMoveBox: false,
                autoCropHeight: 100,
                autoCropWidth: 100
            }
        }
    },
    components: {VueCropper},
    computed: {
        ...mapGetters(["currentRoomUuid", "currentRoomName", "currentRoomSaveAction","IMG"])
    },
    props:{
        reqImgData: {
            type: Object,
            default () {
                return { 
                    url: process.env.VUE_APP_CLIENT_SOCKET,
                    imgDatas: ""
                }
            }
        }
    },
    methods:{
        // 确定裁剪图片
        handleOnCubeImg() {
            // 获取cropper的截图的base64 数据
            this.$refs.cropper.getCropData(data => {
                this.$emit('recReqImgData', data)
                this.$emit('recCropperShow', false)
                //将剪裁后的图片执行上传
                uploadBase64(this.reqImgData).then(res => {
                    let img = `<img class='chat_img'  preview='1' preview-text='' width='100' src='${process.env.VUE_APP_CLIENT_SOCKET+res.data.path}'>`;
                    chatSend({
                        data: {
                        msg: img,
                        room_uuid: this.currentRoomUuid,
                        type: this.IMG,
                        save_action:this.currentRoomSaveAction
                        }
                    });
                    this.$emit('recReqImgData', '')
                });
            });
        },
        handleOnRawImg() {
            this.$emit('recCropperShow', false)
            Loading.open('上传中...')
            uploadBase64(this.reqImgData).then(res => {
                Loading.close()
                let img = `<img class='chat_img'  preview='1' preview-text='' width='100' src='${process.env.VUE_APP_CLIENT_SOCKET+res.data.path}'>`;
                chatSend({
                data: {
                    msg: img,
                    room_uuid: window.room_uuid,
                    room_uuid: this.currentRoomUuid,
                    type: this.IMG,
                    save_action:this.currentRoomSaveAction
                }
                });
                this.$emit('recReqImgData', '')
            }).catch(e=>{
                this.$emit('recReqImgData', '')
            });
        },
    }
}
</script>
<style lang="scss">
.vue-cropper-box {
    width: 100%;
    height: 100%;
}

.vue-cropper-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
}

.cropper_wrapper{
    height:100%;
    position:absoloute;
    width:100%;
    z-index:9
}
.btn_wrapper{
    position:fixed;
    width:100%;
    height:40px; 
    bottom: 10px;
    z-index: 9;
}
.raw_img{
    float:right;
    margin-left:20px;
    margin-right:10px;
}
.cube_img{
    float:right;
}
</style>
