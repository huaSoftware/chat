<!--
 * @Author: hua
 * @Date: 2019-07-18 08:54:06
 * @description: 功能栏页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:36:19
 -->
 
<template>
    <!-- 功能栏 -->
    <div class="defs_wrapper">
      <!--轮播-->
      <div class="swiper-container swiper-cont">
        <div class="swiper-wrapper">
          <div class="swiper-slide" style="padding:20px;padding-top:3px">
            <div class="yd-grids-raw">
              <a
                href="#"
                class="yd-grids-item-raw"
                v-for="(item, index) in Menu"
                :key="index"
                @click="handleDef(item.router)"
              >
                <yd-icon class="yd-grids-icon" slot="icon" :name="item.icon" custom color="#00C2E6"></yd-icon>
                <span class="yd-grids-text" slot="text">{{item.name}}</span>
              </a>
            </div>
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
        <!-- 视频标签 -->
        <video id="localvideo" autoplay  style="height:400px;width:400px"/>
        <video id="remotevideo" autoplay />
      </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import vImg from '@/components/v-img/v-img'
import {Alert} from "vue-ydui/dist/lib.rem/dialog"
export default {
    components: {
        vImg
    },
    data(){
        return{
            Menu: [
                {
                icon: "uniE903",
                name: "图片",
                router: "img"
                },
                {
                icon: "uniE904",
                name: "文件",
                router: "file"
                }/* ,
                {
                icon: "dingw",
                name: "位置",
                router: "position"
                } */
                /* ,
                {
                icon: "video",
                name: "视频",
                router: "video"
                } */
            ]
        }
    },
    computed: {
        ...mapGetters([
        "msgList",
        "currentRoomUuid",
        "currentRoomName",
        "currentRoomType",
        "userInfo",
        "htmlFontSize",
        "currentRoomSaveAction",
        "RECORD",
        "TEXT",
        "RESEND",
        "IMG",
        "FILE",
        "LOADING",
        "SUCCESS",
        "FAIL"
        ])
    },
    created(){

    },
    methods:{
        handleDef(value) {
            let that = this;
            if (value == "video") {
                const localVideo = document.getElementById("localvideo");
                let stream = null;
                //获取视频流
                navigator.mediaDevices.getUserMedia({
                    audio: true, 
                    video: true
                }).then((stream)=>{
                     //localVideo.srcObject = stream;
                    //记录本地视频流
                    var MediaStreamRecorder = require('msr');
                    var mediaRecorder = new MediaStreamRecorder(stream);
                    mediaRecorder.mimeType = 'video/webm';
                    mediaRecorder.ondataavailable =  (blob)=> {
                        // POST/PUT "Blob" using FormData/XHR2
                        window.apiSocket.emit('video',{data:{blob,room_uuid:this.currentRoomUuid}});
                    };
                    mediaRecorder.video = localVideo;
                    mediaRecorder.onStartedDrawingNonBlankFrames = function() {
                        // record audio here to fix sync issues
                        mediaRecorder.clearOldRecordedFrames(); // clear all blank frames
                       
                    };
                    mediaRecorder.start(1000);
                });
               
                            
            }
            if (value == "img") {
                document.getElementById("img").click();
            }
            if (value == "fav") {
                this.$router.push("/person/favHistory");
            }
            if (value == "position") {
                if (window.plus) {
                this.getCurrentPosition();
                } else {
                setTimeout(() => {
                    Alert({ mes: "该功能只能在app内使用" });
                }, 300);
                }
            }
            if (value == "file") {
                document.getElementById("file").click();
            }
        }
    }
}
</script>
<style lang="scss">
.swiper-wrapper {
    height: 200px !important;
}
.defs_wrapper {
    height: 200px !important;
    width: 100%;
    max-width: 750px;
    min-width: 300px;
    border-top: 1px solid #e9e9e9;
    text-align: left;
    overflow-x: auto;
    background: #fff;
    flex-wrap: wrap;
    position:fixed;
    bottom:0rem;
    text-align: center;
}

.yd-grids-item:after {
    border-bottom: 0px;
}

.yd-grids-4 .yd-grids-item:not(:nth-child(4n)):before {
    border-right: 0px;
}
.yd-grids-raw {
    overflow: hidden;
    position: relative;
    background-color: #fff;
}

.yd-grids-raw .yd-grids-item {
    width: 25%;
}

.yd-grids-item-raw {
    width: 25%;
    float: left;
    position: relative;
    z-index: 0;
    padding: .35rem 0;
    font-size: .28rem;
}


</style>
