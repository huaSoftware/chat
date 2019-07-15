<!--
 * @Author: hua
 * @Date: 2019-02-26 09:08:43
 * @LastEditors: hua
 * @LastEditTime: 2019-07-15 09:42:26
 -->
<template>
    <div style="font-size: 0;">
        <!-- 内容 -->
        <div class="content_wapper" ref="bscroll" @touchstart="closeDefIconsShow()">
            <div class="bscroll-container">
                <ul>
                    <li v-for="(key, index) in msgList" :key="index">
                        <div class="chat-item" v-if="key.user_id == user.id">
                            <div class="mychat">
                                <img :src="key.head_img" alt="" class="img">
                                <div class="nt">
                                    <span v-html="key.name"></span>
                                </div>
                                <div v-if="key.type == 0" class="msg" @touchstart="amrPlay(key.msg, index)">
                                    <img class="vioce_start" style="margin-right:-3px" src="static/img/voice_left.gif"
                                        :alt="key.msg" v-show="key.status"/>
                                    <i class="vioce_stop_left" v-show="!key.status"></i><span class="vioce_second">{{key.duration}}s</span>
                                </div>
                                <div v-else-if="key.type == 1" class="rawMsg" v-html="key.msg">{{key.msg}}</div>
                                <div v-else class="msg" v-html="key.msg"></div>
                                <!-- 消息送达状态 -->
                                <span v-if="key.send_status == 0 " class="send_status loading_color rotate_loading"><yd-icon name="refresh"></yd-icon> </span>
                                <span  @click="reSendMsg(key.created_at)" v-if="key.send_status == 2" class="send_status color_danger"><yd-icon name="error"></yd-icon></span>
                            </div>
                        </div>
                        <div class="chat-item"  v-else>
                            <div class="otherchat">
                                <img class="img"  :src="key.head_img" />
                                <div class="nt">
                                    <span v-html="key.name"></span>
                                </div>
                                <div v-if="key.type == 0" class="msg" @touchstart="amrPlay(key.msg, index)">
                                    <img class="chat_right vioce_start" src="static/img/voice_right.gif" v-show="key.status">
                                    <i class="vioce_stop_right" v-show="!key.status"></i><span class="vioce_second">{{key.duration}}s</span>
                                </div>
                                <div v-else-if="key.type == 1" class="rawMsg" v-html="key.msg">
                                    
                                </div>
                                <div v-else class="msg" v-html="key.msg"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 语音输入gif图 -->
        <img v-show="recordingShow" style="position:absolute; top:40%;width:50%;margin-left:25%;" src="static/img/recording.gif">
        <!-- 输入 -->
        <div class="input_wapper" :style="iconsShow || defsShow ?'bottom:200px':'bottom:0.2rem'">
            <div class="voice" @click="handleRecordShow">
                <yd-icon slot="icon" name="uniE906" custom></yd-icon>
            </div>
            <!-- 语音输入 -->
            <div :class="touched? 'record touched':'record'" v-show="recordShow" @touchstart="startRecord" @touchend="stopRecord">按住
                说话</div>
            <!-- 输入栏 -->
            <vEditDiv v-show="!recordShow" @click.native="closeDefIconsShow" class='input' id="edit" placeholder='请输入文字'
                v-model="content"></vEditDiv>
            <div class="def" @click="handleIconsShow">
                <yd-icon slot="icon" name="uniE905" custom></yd-icon>
            </div>
            <div class="def" style="padding-left:0px;" @click="handleDefsShow" v-show="!sendShow">
                <yd-icon slot="icon" name="jia2" custom></yd-icon>
            </div>
            <div class="def" style="padding-left:0px;" v-show="sendShow">
                <yd-button @click.native="sendMsg()" type="disabled" size="small" bgcolor="#00C2E6" color="#fff">发送</yd-button>
            </div>
            <!-- 隐藏的输入框 -->
            <input name="img" style="display:none;" id="img" type="file" accept="image/*" @change="handleOnChange($event)" />
            <input name="file" style="display:none;" id="file" type="file" @change="handleFileOnChange($event)" />
        </div>
         <!-- 表情 -->
         <div class="icons_wapper" v-show="iconsShow">
            <!--轮播-->
            <div class="swiper-container swiper-cont">
                <div class="swiper-wrapper">
                    <!-- <div class="swiper-slide">
                        <img @click="insertIcon('static/icons/onion/zwj'+i+'.gif')" v-for="i in 28" :src="'static/icons/onion/zwj'+i+'.gif'" :key="i" />
                    </div>
                    <div class="swiper-slide">
                        <img @click="insertIcon('static/icons/rabbits/tsj'+addPreZero(i)+'.gif')" v-for="i in 35" :key="i"
                            :src="'static/icons/rabbits/tsj'+addPreZero(i)+'.gif'" />
                    </div> -->
                    <div class="swiper-slide">
                        <img @click="insertIcon('static/icons/more/'+i+'.gif')" v-for="i in 32" :src="'static/icons/more/'+i+'.gif'" :key="i"/>
                    </div>
                </div>
                <!-- 如果需要分页器 -->
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <!-- 功能栏 -->
        <div class="defs_wapper" v-show="defsShow">
            <!--轮播-->
            <div class="swiper-container swiper-cont">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" style="padding:20px;padding-top:3px">
                        <!-- <yd-grids-group :rows="4">
                    <yd-grids-item v-for="(item, index) in footerMenu" :key='index'  @click.native="handleDef(item.router)">
                        <yd-icon slot="icon" :name="item.icon" custom color="#00C2E6"></yd-icon>
                        <span slot="text">{{item.name}}</span>
                    </yd-grids-item>
                  </yd-grids-group > -->
                        <div class="yd-grids-raw">
                            <a href="#" class="yd-grids-item-raw" v-for="(item, index) in footerMenu" :key='index'
                                @click="handleDef(item.router)">
                                <yd-icon class="yd-grids-icon" slot="icon" :name="item.icon" custom color="#00C2E6"></yd-icon>
                                <span class="yd-grids-text" slot="text">{{item.name}}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- 如果需要分页器 -->
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <!-- 裁剪图 -->
        <!-- vueCropper 剪裁图片实现-->
        <div class="vue-cropper-box" v-if="cropperShow">
            <div class="vue-cropper-content">
                <vueCropper style="height:100%;position:absoloute;width:100%;z-index:9999" ref="cropper" :img="option.img"
                    :outputSize="option.size" :outputType="option.outputType" :canMoveBox="option.canMoveBox" :canMove="option.canMove"
                    :autoCrop="true" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight"
                    ></vueCropper>
            </div>
            <!-- 截图功能键 -->
            <div style="position:fixed;width:100%;height:40px; bottom: 10px;z-index: 99999;">
                <yd-button @click.native="handleOnRawImg" type="primary" style="float:right;line-height:40px;height:40px;margin-left:20px;margin-right:10px;">原图</yd-button>
                <yd-button @click.native="handleOnCubeImg" type="warning" style="float:right;line-height:40px;height:40px;">裁剪</yd-button>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { mapGetters, mapMutations} from "vuex";
    import vEditDiv from '@/components/v-edit-div/v-edit-div'
    import BScroll from 'better-scroll'
    import VConsole from 'vconsole/dist/vconsole.min.js'
    import {uploadBase64, uploadFile} from '@/api/common'
    import { VueCropper } from "vue-cropper"
    import utils from '@/utils/utils'
    import storage from "@/utils/localstorage"
    import {getRoomMsg} from "@/utils/indexedDB"
    import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog'
    import {send} from '@/utils/socketio'
    import {chatSend, reChatSend} from '@/socketIoApi/chat'
    import store from '../../store'
    export default {
        components: {
            vEditDiv,
            VueCropper
        },
        computed: {
            ...mapGetters([
                "msgList",
                "currentRoomUuid",
                "currentRoomName"
            ])
        },
        data() {
            return {
                uuidVal: '',
                scroll: '',
                content: '',
                iconsShow: false,
                defsShow: false,
                sendShow: false,
                recordShow: false,
                recordingShow: false,
                touched: false,
                cropperShow: false,
                lockDown:false,
                lockEnd:false,
                footerMenu: [{
                    icon: 'uniE903',
                    name: '图片',
                    router: 'img'
                },  {
                    icon: 'uniE904',
                    name: '文件',
                    router: 'file'
                }, {
                    icon: 'dingw',
                    name: '位置',
                    router: 'position'
                }],
                data: [],
                msgReq:{
                    page:1,
                    per_page: 10
                },
                reqImgData: {
                    url: process.env.BASE_API,
                    imgDatas: ''
                },
                option: {
                    img: '',
                    size: 1,
                    outputType: 'png',
                    canMove: false,
                    canMoveBox: false,
                    autoCropHeight: 100,
                    autoCropWidth: 100
                },
                user:{}
            }
        },
        created() {
            this.updateMsgList([])
            this.user = storage.get('user')
            //路由传参
           if(this.currentRoomUuid){
                //后期将window的去除改为vuex内
                window.room_uuid = this.currentRoomUuid
                getRoomMsg(this.currentRoomUuid, this.msgReq.page, this.msgReq.per_page).then(res=>{
                    this.updateMsgList(res.list)
                })
            }
            try {
                // 扩展API加载完毕后调用onPlusReady回调函数 
                document.addEventListener("plusready", onPlusReady(), false);
                // 扩展API加载完毕，现在可以正常调用扩展API 
                function onPlusReady() {
                    window.r = plus.audio.getRecorder()
                }
            } catch (e) {
                //console.log('不是app内')
            }
        },
        mounted() {
            let that = this
            this.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
            new Swiper('.swiper-cont', {
                loop: false,
                autoplay: false, //可选选项，自动滑动
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                observer: true,
                observeParents: true
            })
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.bscroll, {
                        click: false,
                        scrollY: true,
                        probeType: 3
                    });
                    this.scroll.on('touchEnd', (pos) => {
                        // 下拉动作
                        if (pos.y > 50) {
                            if(!this.lockEnd){
                                Notify({
                                    mes: '正在加载中',
                                    timeout: 2000
                                })
                                this.lockDown = true
                                this.msgReq.page++
                                getRoomMsg(this.currentRoomUuid, this.msgReq.page, this.msgReq.per_page).then(res=>{
                                    if(res.list.length == 0){
                                        this.lockEnd = true
                                    }else{
                                        let msgList = JSON.parse(JSON.stringify(this.msgList))
                                        msgList = res.list.concat(msgList)
                                        this.updateMsgList(msgList)
                                    }
                                })
                            }else{
                                Notify({
                                    mes: '没有更多内容了',
                                    timeout: 2000
                                })
                            }
                        }
                    })
                }
            })
            window.onresize = function () {
                setTimeout(()=>{
                    that.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
                    that.handleSendShow()
                }, 300)
            }
        },
        beforeRouteEnter (to, from, next) {
            
            to.meta.title = to.query.name

            next()
        },
        destroyed(){
            if(Vue.prototype.$preview.self){
                Vue.prototype.$preview.self.close()
            }
            send('leave', {room_uuid: window.room_uuid})
        },
        activated() {
            window.physicsBackRouter = '/home'
        },
        methods: {
            ...mapMutations({
                updateMsgList:'updateMsgList'
            }),
            handleFileOnChange(event) {
                let file = event.target.files[0];
                let data = new FormData(); //重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
                data.append("file", file)
                uploadFile(data).then(res => {
                    let file_path = process.env.BASE_API + res.data.path
                    let file =
                        `<a ontouchstart="downLoad('${file_path}','${res.data.name}')">${res.data.name}</a>`
                    chatSend({
                        data: {
                            msg: file,
                            room_uuid: window.room_uuid,
                            type: 1
                        }
                    })
                })
            },
            handleOnChange(event) {
                let that = this
                let file = event.target.files[0];
                ////console.log((file.type).indexOf("image/"))
                if((file.type).indexOf("image/")==-1){  
                    Alert({mes: "请上传图片!"})
                    return 
                } 
                //创建读取文件的对象
                let reader = new FileReader();

                //为文件读取成功设置事件
                reader.onload = function (e) {
                    that.option.img = e.target.result;
                    that.cropperShow = true
                    ////console.log(that.option.img)
                }
                //正式读取文件
                reader.readAsDataURL(file);
            },
            // 确定裁剪图片
            handleOnCubeImg() {
                // 获取cropper的截图的base64 数据
                this.$refs.cropper.getCropData(data => {
                    this.reqImgData.imgDatas = data
                    this.cropperShow = false
                    //先将显示图片地址清空，防止重复显示
                    this.option.img = ''
                    //将剪裁后的图片执行上传
                    uploadBase64(this.reqImgData).then(res => {
                        let img = '<img class="chat_img" preview="1" preview-text="" width="100" src="' + process.env.VUE_APP_CLIENT_API + res.data.path +'">'
                        chatSend({
                            data: {
                                msg: img,
                                room_uuid: window.room_uuid,
                                type: 1
                            }
                        })
                    })
                })
            },
            handleOnRawImg() {
                this.reqImgData.imgDatas = this.option.img
                this.cropperShow = false
                //先将显示图片地址清空，防止重复显示
                this.option.img = ''
                uploadBase64(this.reqImgData).then(res => {
                    let img = '<img class="chat_img"  preview="1" preview-text="" width="100" src="' +process.env.VUE_APP_CLIENT_API+ res.data.path + '">'
                    chatSend({
                        data: {
                            msg: img,
                            room_uuid: window.room_uuid,
                            type: 1
                        }
                    })
                })
            },
            handleDef(value) {
                let that = this
                if (value == 'img') {
                    document.getElementById('img').click()
                }
                if (value == 'fav') {
                    this.$router.push('/person/favHistory')
                }
                if (value == 'position') {
                    if(window.plus){
                        this.getCurrentPosition()
                    }else{
                        setTimeout(
                            ()=>{
                                Alert({mes:'该定位只能在app内使用'})
                            },300
                        )
                    }
                }
                if (value == 'file') {
                    document.getElementById('file').click()
                }
            },
            // 扩展API加载完毕，现在可以正常调用扩展API
            getCurrentPosition() {
                plus.geolocation.getCurrentPosition(function (p) {
                    //console.log(p)
                    chatSend({
                        data: {
                            msg: p.addresses,
                            room_uuid: window.room_uuid,
                            type: 1
                        }
                    })
                }, function (e) {
                    switch (e.code) {
                        case e.PERMISSION_DENIED:
                            alert('User denied the request for Geolocation.');
                            break;
                        case e.POSITION_UNAVAILABLE:
                            alert('Location information is unavailable.');
                            break;
                        case e.TIMEOUT:
                            alert('The request to get user location timed out.');
                            break;
                        case e.UNKNOWN_ERROR:
                            alert('An unknown error occurred.');
                            break;
                    }
                });
            },
            sendMsg() {
                this.created_at = parseInt(new Date().getTime()/1000)
                chatSend({
                    data: {
                        msg: this.content,
                        room_uuid: window.room_uuid,
                        type: 1//1是文字，0是语音, 2是重发
                    }
                })
                document.getElementById('edit').innerHTML = ''
                this.content = ''
                this.closeDefIconsShow()
                //console.log(this.content)
            },
            reSendMsg(created_at){
               reChatSend({
                    data: {
                        room_uuid: window.room_uuid,
                        type: 2,//1是文字，0是语音, 2是重发
                        created_at: created_at
                    }
                })
            },
            handleRecordShow() {
                this.recordShow = !this.recordShow
            },
            closeDefIconsShow() {
                this.iconsShow = false
                this.defsShow = false
                this.recordShow = false
                this.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
            },
            handleSendShow() {
                if (this.content.length >= 1) {
                    this.sendShow = true
                } else {
                    this.sendShow = false
                }
            },
            handleMsgListToBottom(){
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.bscroll, {
                            click: false,
                            scrollY: true,
                            probeType: 3
                        });
                    } else {
                        this.scroll.refresh();
                    }
                    if(!this.lockDown){
                        this.scroll.scrollTo(0, this.scroll.maxScrollY)
                        setTimeout(()=>{
                            this.$previewRefresh()
                        },200)
                    }
                    this.lockDown = false
                })
            },
            handleDefsShow() {
                if (this.defsShow) {
                    this.$refs.bscroll.style.height = (document.body.offsetHeight - 100) + 'px'
                } else {
                    this.$refs.bscroll.style.height = (document.body.offsetHeight - 300) + 'px'
                }
                this.defsShow = !this.defsShow
                this.iconsShow = false
                this.recordShow = false
                this.handleSendShow();
                if (this.iconsShow == false && this.defsShow == false) {
                    this.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
                }
            },
            handleIconsShow() {
                if (this.iconsShow) {
                    this.$refs.bscroll.style.height = (document.body.offsetHeight - 100) + 'px'
                } else {
                    this.$refs.bscroll.style.height = (document.body.offsetHeight - 300) + 'px'
                }
                this.iconsShow = !this.iconsShow
                this.defsShow = false
                this.recordShow = false
                this.handleSendShow();
                if (this.iconsShow == false && this.defsShow == false) {
                    this.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
                }
            },
            addPreZero(num) {
                if (num < 10) {
                    return '00' + num;
                } else if (num < 100) {
                    return '0' + num;
                } else if (num < 1000) {
                    return num;
                } else {
                    return num;
                }
            },
            insertIcon: function (src) {
                this.content = this.content + '<img src="' + src + '">'
            },
            // 录音开始
            startRecord() {
                let that = this
                this.touched = true
                if(window.plus){
                    this.defsShow = false
                    this.iconsShow = false
                    this.recordingShow = true
                    if (typeof window.r == 'undefined') {
                        this.recordingShow = false
                        this.touched = false
                        alert("Device not ready!");
                        return;
                    }
                    window.r.record({
                        filename: "_doc/audio/"
                    }, function (p) {
                        //console.log('录音完成:' + p)
                        //上传
                        var task = plus.uploader.createUpload('http://118.25.6.169:89/v2.api/upload', {
                            method: "post"
                        }, function (t, status) {
                            if (status == 200) {
                                let data = JSON.parse(t.responseText)
                                that.recordingShow = false
                                var BenzAMRRecorder = require('benz-amr-recorder');
                                var amr = new BenzAMRRecorder();
                                let url = 'http://118.25.6.169:89' + data.data.path
                                amr.initWithUrl(url).then(function () {
                                    //获取录音长度
                                    //amr.getDuration(); 
                                    chatSend({
                                        data: {
                                            msg: url,
                                            duration: amr.getDuration(),
                                            status: false,
                                            name: window.name,
                                            room_uuid: window.room_uuid,
                                            type: 0
                                        },
                                        room: 'test'
                                    })
                                })
                            } else {
                                //console.log(t.responseText)
                                //console.log("上传失败：" + status);
                            }
                        })
                        let fileName = p.replace("_doc/audio/", '')
                        task.addFile(p, {
                            "key": "test",
                            "name": fileName
                        });
                        task.start();

                        /* plus.io.resolveLocalFileSystemURL(p, function(entry){
                //播放
                let cp = plus.audio.createPlayer('http://118.25.6.169:1215/upload/test.amr');//'_doc/audio/'+entry.name);
                cp.play(function(){
                    //console.log('播放完成！');
                    // 操作播放对象
                    if(cp){
                    cp.stop();
                    cp=null;
                    }
                }, function(e){
                    //console.log('播放音频文件"_doc/audio/'+entry+'"失败：'+e.message);
                });
                }, function(e){
                //console.log('读取录音文件错误：'+e.message);
                });
            }, function (e) {
                alert( "Audio record failed: " + e.message ); */
                    });
                }else{
                    Alert({mes:'录音只能在app内使用'})
                }
            },
            // 录音结束
            stopRecord() {
                this.touched = false
                if(window.plus){
                    window.r.stop();
                }
            },
            amrPlay(url, index) {
                let that = this
                Vue.set(this.data[index].data, 'status', true)
                var BenzAMRRecorder = require('benz-amr-recorder');
                var amr = new BenzAMRRecorder();
                amr.initWithUrl(url).then(function () {
                    //获取录音长度
                    //amr.getDuration();
                    amr.play();
                });
                amr.onEnded(function () {
                    Vue.set(that.data[index].data, 'status', false)
                })
            }
        },
        watch: {
            //监听聊天数据变动
            'content': 'handleSendShow',
            'data': 'handleSendShow',
            'msgList': 'handleMsgListToBottom'
        },
    }
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
@import './scss/room';   
</style>