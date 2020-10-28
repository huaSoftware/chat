<!--
 * @Author: hua
 * @Date: 2019-01-17 14:38:02
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-10-28 21:30:10
 -->
<!-- 头部组件 -->
<style>
.modal-open { 
    overflow: inherit ;
    padding-right: 0px !important;
}
</style>
<template>
<div style="width:100%;min-width: 503px">
    <!-- 菜单栏 -->
    <div id="title" style="-webkit-app-region: drag;">
        <div class="titlebar" style="background-color:rgb(48, 65, 86);">
            <div class="header_container_left" >
                <!-- <img style="width:88px;margin-right:10px;" src="@/images/logo_v1.png"/> -->
                <!-- <span>看主播，领红包，最高每小时5元，可提现！！一个互惠互利的直播自助推广平台！</span> -->
            </div>
            <div class="titlebar-controls">
                <div class="titlebar-minimize" style="-webkit-app-region:  no-drag" @click="minimize">
                    <svg x="0px" y="0px" viewBox="0 0 10 1">
                        <rect fill="#FFFFFF" width="10" height="1"></rect>
                    </svg>
                </div>
                <div class="titlebar-resize" style="-webkit-app-region:  no-drag" @click="resize">
                    <svg class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 10 10" v-if="!fullscreenShow">
                        <path fill="#FFFFFF" d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z " ></path>
                    </svg>
                    <svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10" v-else>
                        <mask id="Mask">
                            <rect fill="#FFFFFF" width="10" height="10"></rect>
                            <path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z"></path>
                            <path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z"></path>
                        </mask>
                        <path fill="#FFFFFF" d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)"></path>
                    </svg>
                </div>
                <div class="titlebar-close" style="-webkit-app-region:  no-drag" @click="close"> 
                    <svg x="0px" y="0px" viewBox="0 0 10 10">
                        <polygon fill="#FFFFFF" points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import { getToken, setToken } from '@/utils/auth'

const shell = require('electron').shell;
export default {
    /**
     *  state #登陆注册显示状态
     *  0 #未登录显示微信登陆
     *  1 #未登录显示手机登陆
     *  2 #未登录显示邮箱登陆
     *  3 #未注册显示手机注册
     *  4 #未注册显示邮箱注册 
     *  5 #未注册显示微信注册
     */
    components: {},
    data () {
        return {
            fullscreenShow: false,
            base_url: process.env.BASE_API,
            defaultImgUrl: 'this.src="' + require('@/assets/img/default.png') + '"',
            state: 1,
            lock:false
        }
    },
    watch: {
    
    },
    methods: {
        minimize(){
            let mainWindow = window.require('electron').remote.getCurrentWindow(); 
            mainWindow.minimize();
        },
        resize(){
            let mainWindow = window.require('electron').remote.getCurrentWindow(); 
            //console.log(mainWindow.isMaximized(), mainWindow.isMinimized())
            //mainWindow.unmaximize()
            if(this.fullscreenShow){
                this.fullscreenShow = false
                mainWindow.unmaximize()
            }else{
                this.fullscreenShow = true
                mainWindow.maximize();
            }
        },
        close(){
            let mainWindow = window.require('electron').remote.getCurrentWindow(); 
            mainWindow.close();
        },
        formatImg(url,img){
            if(img.indexOf('http') !== -1){
                return img
            }
            return url+img
        }
    },
    filters: {},
    computed: {
        ...mapState([
            'user'
        ]),
        modalLoginShow:{
            get(){
                return this.$store.state.user.modalLoginShow
            },
            set(val){
                this.$store.state.user.modalLoginShow = val
            }
        }
    },
    created () {
        //检测是否存在token

        //this.modalLoginShow = true
    },
    mounted () {
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

/* 头部 */
.header_container{
    justify-content: space-between;
    height: 0px;
    color: #fff;
    display: flex;
    flex-direction: row;
    width: 100%;
    min-width: 503px;
    align-items: center;
}
.header_container_left{
    margin: 15px 15px 15px 20px;
    display: inline-block;
    color:#fff;
    img{
        max-height:50px;
    }
    span{
        font-size:22px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        /* font-style:italic; */
        line-height:18px;
    }
}
.header_container_right{
    margin-right: 20px;
    position: relative;
    display:flex;
    /* align-items:center; */
}
.my_message{
    display: flex;
    /* align-items:center; */
}
.my_text{
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    p{
        line-height:21px;
        font-size:12px;
        margin: 0;
        display: flex;
        flex-direction:row-reverse;
    }
}
.my_image{
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #fff;
    overflow: hidden;
    img{
        width: 100%;
        height: 100%;
    }
}
.messages{
    margin-left:20px;
}
@media (max-width: 500px) {
    .header_container {
    display: block;
    height:120px;
    }
    .header_container_left{
    text-align: left;
    }
    .header_container_right{
    text-align: right;
    justify-content: center;
    float: right;
    }
}

    .titlebar-minimize{
    cursor:pointer;
    color:#fff;
  }
  .titlebar-resize{
    cursor:pointer;
    color:#fff;
  }
  .titlebar-close{
    cursor:pointer;
    color:#fff;
    /* border-top-right-radius: 10px; */
  }
  .titlebar
  {
    display: block;
    position: relative;
    height: 32px;
    padding: 0;
    text-align: center;
    /* border-radius: 10px; */
  }

  .titlebar.draggable
  {
    -webkit-app-region: drag;
  }

  .titlebar-controls
  {
    float: right;
    text-align: left;
  }

  .titlebar:after,
  .titlebar-controls:after
  {
    content: ' ';
    display: table;
    clear: both;
  }

  .titlebar-minimize,
  .titlebar-resize,
  .titlebar-close
  {
    float: left;
    width: 45px;
    height: 31px;
    margin: 1px 1px 0 0;
    text-align: center;
    line-height: 29px;

    -webkit-transition: background-color .2s;
    -moz-transition: background-color .2s;
    -ms-transition: background-color .2s;
    -o-transition: background-color .2s;
    transition: background-color .2s;
  }

  .titlebar.draggable .titlebar-minimize,
  .titlebar.draggable .titlebar-resize,
  .titlebar.draggable .titlebar-close
  {
    -webkit-app-region: no-drag;
  }

  .titlebar-minimize svg,
  .titlebar-resize svg.maximize-svg,
  .titlebar-resize svg.fullscreen-svg,
  .titlebar-close svg
  {
    width: 10px;
    height: 10px;
    shape-rendering: crispEdges;
  }

  .titlebar-close svg polygon
  {
    -webkit-transition: fill .2s;
    -moz-transition: fill .2s;
    -ms-transition: fill .2s;
    -o-transition: fill .2s;
    transition: fill .2s;
  }


  .titlebar-minimize:hover,
  .titlebar-resize:hover,
  .titlebar-fullscreen:hover
  {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .titlebar-light .titlebar-minimize:hover,
  .titlebar-light .titlebar-resize:hover,
  .titlebar-light .titlebar-fullscreen:hover
  {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .titlebar-close:hover
  {
    background-color: rgba(232, 17, 35, 0.9);
  }

  .titlebar-close:hover svg polygon
  {
    fill: rgba(255, 255, 255, 1);
  }

  .titlebar-light .titlebar-close:hover
  {
    fill: rgba(0, 0, 0, 1);
  }

  .titlebar-light svg polygon,
  .titlebar-light svg rect,
  .titlebar-light svg > path
  {
    fill: rgba(255, 255, 255, 1);
  }

.titlebar-light .titlebar-close:hover
{
    background-color: rgba(232, 17, 35, 0.9);
}
.nav-item span{
    color: rgb(255, 255, 255);
    display: inline-block;
    height: 40px;
    line-height: 40px;
    margin-left:25px;
    margin-right:25px;
    cursor: pointer;
}
.nav-item span:before{
    padding-right: 5px;  
}
.nav-item span:hover{
    color:#EBAD1F;
}
</style>
