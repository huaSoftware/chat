<template>
    <div style="font-size: 0;height:100%">
        <!-- 内容 -->
        <div class="content_wapper" ref="bscroll" @touchstart="closeDefIconsShow()">
            <div class="bscroll-container">
                <ul>
                    <li v-for="(key, index) in msgList">
                        <!-- <div class="chat-item" v-if="key.data.uuid == ''">
                            <div class="otherchat">
                                <img class="img" src="static/img/head/ni4.jpg" />
                                <div class="nt">
                                    <span v-html="key.data.name"></span>
                                </div>
                                <div class="msg" v-html="key.data.msg"></div>
                            </div>
                        </div> -->
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
                                <div v-else-if="key.type == 1" class="rawMsg" v-html="key.msg"></div>
                                <div v-else class="msg" v-html="key.msg"></div>
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
                                <div v-else-if="key.type == 1" class="rawMsg" v-html="key.msg"></div>
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
        <div class="input_wapper">
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
            <!-- 表情 -->
            <div class="icons_wapper" v-show="iconsShow">
                <!--轮播-->
                <div class="swiper-container swiper-cont">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img @click="insertIcon('static/icons/onion/zwj'+i+'.gif')" v-for="i in 28" :src="'static/icons/onion/zwj'+i+'.gif'" />
                        </div>
                        <div class="swiper-slide">
                            <img @click="insertIcon('static/icons/rabbits/tsj'+addPreZero(i)+'.gif')" v-for="i in 35"
                                :src="'static/icons/rabbits/tsj'+addPreZero(i)+'.gif'" />
                        </div>
                        <div class="swiper-slide">
                            <img @click="insertIcon('static/icons/more/'+i+'.gif')" v-for="i in 35" :src="'static/icons/more/'+i+'.gif'" />
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
            <!-- 隐藏的输入框 -->
            <input name="img" style="display:none;" id="img" type="file" accept="image/*" @change="handleOnChange($event)" />
            <input name="file" style="display:none;" id="file" type="file" @change="handleFileOnChange($event)" />
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
    export default {
        components: {
            vEditDiv,
            VueCropper
        },
        computed: {
            ...mapGetters(["msgList"])
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
            //this.updateMsgList(getRoomMsg())
            this.user = storage.get('user')
            if(typeof this.$route.query.room_uuid !== 'undefined'){
                window.uuid = this.$route.query.room_uuid
                getRoomMsg(window.uuid).then(res=>{
                    this.updateMsgList(res)
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
                console.log('不是app内')
            }
        },
        mounted() {
            let that = this
            this.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
            //document.getElementById('edit').focus();
            new Swiper('.swiper-cont', {
                loop: false,
                autoplay: false, //可选选项，自动滑动

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    //dynamicBullets: true
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
                }
            })
            window.onresize = function () {
                that.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
                that.handleSendShow()
            }
        },
        destroyed() {

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
                    window.roomSocket.emit('chat', {
                        data: {
                            msg: file,
                            userId: this.user.id,
                            uuid: window.uuid,
                            type: 1
                        }
                    })
                })
            },
            handleOnChange(event) {
                let that = this
                let file = event.target.files[0];
                console.log((file.type).indexOf("image/"))
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
                    console.log(that.option.img)
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
                        let img = '<img ontouchstart="magPic(event)" height="50" src="' + process.env.VUE_APP_CLIENT_API + res.data.path +
                            '">'
                        window.roomSocket.emit('chat', {
                            data: {
                                msg: img,
                                userId: this.user.id,
                                uuid: window.uuid,
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
                    let img = '<img ontouchstart="magPic(event)" height="50" src="' +process.env.VUE_APP_CLIENT_API+ res.data.path + '">'
                    console.log(img)
                    window.roomSocket.emit('chat', {
                        data: {
                            msg: img,
                            userId: this.user.id,
                            uuid: window.uuid,
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
                    console.log(p)
                    window.roomSocket.emit('chat', {
                        data: {
                            msg: p.addresses,
                            userId: this.user.id,
                            uuid: window.uuid,
                            type: 1
                        }
                    })
                }, function (e) {
                    console.log('Gelocation Error: code - ' + e.code + '; message - ' + e.message);
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
                console.log(this.user)
                window.roomSocket.emit('chat', {
                    data: {
                        msg: this.content,
                        uuid: window.uuid,
                        userId: this.user.id,
                        type: 1 //1是文字，0是语音
                    }
                },  (e)=>{
                    console.log('发送成功')
                })
                document.getElementById('edit').innerHTML = ''
                this.content = ''
                console.log(this.content)
            },
            handleRecordShow() {
                this.recordShow = !this.recordShow
            },
            closeDefIconsShow() {
                this.iconsShow = false
                this.defsShow = false
                this.recordShow = false
                this.$refs.bscroll.style.height = (document.body.clientHeight - 100) + 'px'
                //document.getElementById('edit').focus();
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
                    this.scroll.scrollTo(0, this.scroll.maxScrollY)
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
                console.log(this.content)
                //this.insertHtmlAtCaret(img)
            },
            uuid() {
                var s = [];
                var hexDigits = "0123456789ABCDEFG";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
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
                        console.log('录音完成:' + p)
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
                        
                                    window.roomSocket.emit('chat', {
                                        data: {
                                            msg: url,
                                            duration: amr.getDuration(),
                                            status: false,
                                            name: window.name,
                                            uuid: window.uuid,
                                            type: 0
                                        },
                                        room: 'test'
                                    })
                                })
                            } else {
                                console.log(t.responseText)
                                console.log("上传失败：" + status);
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
                    console.log('播放完成！');
                    // 操作播放对象
                    if(cp){
                    cp.stop();
                    cp=null;
                    }
                }, function(e){
                    console.log('播放音频文件"_doc/audio/'+entry+'"失败：'+e.message);
                });
                }, function(e){
                console.log('读取录音文件错误：'+e.message);
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
                console.log(this.data[index].data)
                var BenzAMRRecorder = require('benz-amr-recorder');
                var amr = new BenzAMRRecorder();
                amr.initWithUrl(url).then(function () {
                    //获取录音长度
                    //amr.getDuration();
                    amr.play();
                });
                amr.onEnded(function () {
                    Vue.set(that.data[index].data, 'status', false)
                    console.log('播放完毕');
                })
            },
            handleUploadBase64() {
                let that = this
                this.$refs.cropper.getCropData((data) => {
                    that.reqImgData.imgDatas = data
                    uploadBase64(this.reqImgData).then(res => {
                        console.log(res)
                    })
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
<style scoped>
    /**css样式*/
    .input_wapper {
        width: 100%;
        position: fixed;
        bottom: 0px;
        z-index:2;
    }

    .voice {
        width: 13%;
        display: inline-block;
        text-align: center;
        padding: 5px 8px;
        vertical-align: middle;
    }

    .input {
        width: 61%;
        max-height: 100px;
        line-height: 24px;
        font-size: 20px;
        padding: 5px 8px;
        border-bottom: 1px solid #00C2E6;
        overflow-x: auto;
        display: inline-block;
        margin-bottom: 5px;
        vertical-align: middle;
    }

    .input:empty::before {
        content: attr(placeholder);
    }

    .record {
        width: 61%;
        max-height: 100px;
        line-height: 35px;
        font-size: 20px;
        height: 35px;
        border: 1px solid #999999;
        border-radius: 5px;
        /* overflow-x: auto; */
        display: inline-block;
        margin-bottom: 5px;
        vertical-align: middle;
        text-align: center;
    }

    .touched {
        background: #999999;
        color: #fff;
    }

    .def {
        width: 13%;
        display: inline-block;
        text-align: center;
        padding: 5px 8px;
        vertical-align: middle;
    }

    .swiper-wrapper {
        height: 200px !important;
    }

    .icons_wapper {
        height: 200px !important;
        width: 100%;
        border-top: 1px solid #e9e9e9;
        text-align: center;
        overflow-x: auto;
        background: #fff;
    }

    .icons_wapper img {
        margin: 5px;
        width: 40px;
        height: 40px;
    }

    .swiper-pagination {
        height: 21px;
        position: fixed;
    }

    .defs_wapper {
        height: 200px !important;
        width: 100%;
        border-top: 1px solid #e9e9e9;
        text-align: center;
        overflow-x: auto;
        background: #fff;
    }

    .yd-grids-item:after {
        border-bottom: 0px;
    }

    .yd-grids-4 .yd-grids-item:not(:nth-child(4n)):before {
        border-right: 0px;
    }

    .content_wapper {
        width: 100%;
        overflow: hidden;
    }

    .bscroll-container {
        font-size: 0.5rem;
        position: relative;
    }

    /* 聊天 */
    ul {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        width: 100%;
        padding-left: 12px;
        padding-right: 12px;
        padding-bottom: 74px;
        padding-top: 20px;
    }

    .bscroll-container ul li {
        padding: 0;
        margin-top: 20px;
    }

    li {
        display: list-item;
        text-align: -webkit-match-parent;
    }

    .chat-item {
        width: 100%;
        margin: 14px 0;
        height: 0px;
    }

    .chat-item .otherchat {
        width: 100%;
        position: relative;
    }

    .chat-item .otherchat .img {
        width: 39px;
        height: 39px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 4px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        cursor: pointer;
    }

    .chat-item .otherchat .nt {
        font-size: 12px;
        left: 50px;
        top: -26px;
        position: absolute;
        color: #686868;
    }

    .chat-item .otherchat .nt span {
        padding-right: .3rem;
    }

    .chat-item .otherchat .nt span:nth-child(2) {
        font-size: 12px;
    }

    .chat-item .otherchat .msg {
        float: left;
        min-height: 21px;
        max-width: 60% !important;
        margin-left: 50px;
        padding: 6px;
        border-radius: 8px;
        font-size: 14px;
        /* line-height: 2.34rem; */
        background-color: #fff;
    }

    .chat-item .otherchat .rawMsg {
        float: left;
        min-height: 21px;
        max-width: 60% !important;
        margin-left: 45px;
        padding: 6px;
        border-radius: 8px;
        font-size: 14px;
        /* line-height: 2.34rem; */
        background-color: rgb(238, 238, 238);
        position: relative;
        top: 5px;
    }
    .otherchat .rawMsg::before{
        content: "";
        width: 0;
        height: 0;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        border-width: 10px;
        border-style: solid dashed dashed dashed;
        border-color: transparent transparent rgb(238, 238, 238) transparent;
        position: absolute;
        top: -15px;
        left: 0px;
    }
    /* my */
    .chat-item .mychat {
        width: 100%;
        position: relative;
    }

    .chat-item .mychat .img {
        width: 39px;
        height: 39px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        right: 4px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    .chat-item .mychat .nt {
        font-size: 12px;
        right: 50px;
        top: -26px;
        position: absolute;
        color: #686868;
    }

    .chat-item .mychat .msg {
        float: right;
        max-width: 60%;
        margin-right: 50px;
        padding: 6px;
        border-radius: 8px;
        font-size: 14px;
        background-color: #b2e281;
        color: #fff;
        word-wrap: break-word;
    }

    .chat-item .mychat .rawMsg {
        float: right;
        max-width: 60%;
        margin-right: 50px;
        padding: 6px;
        border-radius: 8px;
        font-size: 14px;
         background-color: #b2e281;
        color: #fff;
        word-wrap: break-word;
        position: relative;
        top: 5px;
    }

    .mychat .rawMsg::before{
        content: "";
        width: 0;
        height: 0;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        border-width: 10px;
        border-style: solid dashed dashed dashed;
        border-color: transparent transparent #b2e281 transparent;
        position: absolute;
        top: -15px;
        right: 0px;
    }

    /* 声音 */
    .Rotate {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        /* IE 9 */
        -moz-transform: rotate(180deg);
        /* Firefox */
        -webkit-transform: rotate(180deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(180deg);
        /* Opera */
    }

    .vioce_second {
        vertical-align: top;
        line-height: 23px;
        display: inline-block;
        padding-left: 10px;
    }

    .chat_right {
        height: 23px;
        width: 23px;
    }

    .vioce_start {
        height: 23px;
        width: 23px;
        vertical-align: top;
    }

    .vioce_stop_right {
        /*  background: url('../../assets/img/spriteImg.png') no-repeat; */
        background-position: -200px -433px;
        -webkit-background-size: 487px 462px;
        background-size: 487px 462px;
        display: inline-block;
        vertical-align: middle;
        width: 23px;
        height: 23px;
        margin-right: 4px;
    }

    .vioce_stop_left {
        /* background: url('../../assets/img/spriteImg.png') no-repeat; */
        background-position: -465px -398px;
        -webkit-background-size: 487px 462px;
        background-size: 487px 462px;
        display: inline-block;
        vertical-align: middle;
        width: 23px;
        height: 23px;
        margin-left: 1px;
    }

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

    .yd-grids-icon {
        height: .68rem;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .yd-grids-txt {
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        color: #333;
        padding: 0 .2rem;
    }
</style>