<template>
<div>
    <CrossLine></CrossLine>
    <form id="register_form">
    <div class="yd-cell-box">
        <div class="yd-cell">
            <div class="yd-cell-item">
                <div class="yd-cell-left">
                <span class="yd-cell-icon"></span> 
                <span>头像：</span>
                </div> 
                <div class="yd-cell-right">
                <div class="yd-input" style="flex-direction: row-reverse;">
                        <img  class="head_default" :src="headImg" v-if="headImg" @click="bindFile('header_img_file')"/>
                    <div class="head_default" @click="bindFile('header_img_file')" v-else>上传</div>
                </div>
                <input type="file" id="header_img_file" @change="bindHeaderImg" style="display:none;">
                </div>
            </div> 
            <div class="yd-cell-item">
                <div class="yd-cell-left">
                <span class="yd-cell-icon"></span> 
                <span>昵称：</span>
                </div> 
                <div class="yd-cell-right">
                <div class="yd-input">
                    <input type="text" name="nickName" v-model="nickName" placeholder="请输入昵称" autocomplete="off">
                    <span class="yd-input-error" v-show="validated_status.nickName"></span> 
                    <span class="yd-input-success" style="display: none;"></span> 
                </div>
                </div>
            </div> 
            <div class="yd-cell-item">
                <div class="yd-cell-left">
                <span class="yd-cell-icon"></span> 
                <span>邮箱：</span>
                </div> 
                <div class="yd-cell-right">
                <div class="yd-input">
                    <input type="email" name="email" v-model="email" placeholder="请输入邮箱" autocomplete="off">
                    <span class="yd-input-error" v-show="validated_status.email"></span> 
                    <span class="yd-input-success" style="display: none;"></span> 
                </div>
                </div>
            </div> 
            <div class="yd-cell-item">
                <div class="yd-cell-left">
                <span class="yd-cell-icon"></span> 
                <span>密码：</span>
                </div> 
                <div class="yd-cell-right">
                <div class="yd-input">
                    <input type="password" name="password"  v-model="password" placeholder="请输入6-12位密码" autocomplete="off">
                    <span class="yd-input-error" v-show="validated_status.password"></span>  
                    <a href="javascript:;" tabindex="-1" class="yd-input-password" @click="handlePasswordShow($event.target, passwordShow)" v-show="!passwordShow"></a>
                    <a href="javascript:;" tabindex="-1" class="yd-input-password yd-input-password-open" @click="handlePasswordShow($event.target, passwordShow)" v-show="passwordShow"></a>
                </div>
                </div>
            </div> 
            <div class="yd-cell-item">
                <div class="yd-cell-left">
                <span class="yd-cell-icon"></span> 
                <span>确认密码：</span>
                </div> 
                <div class="yd-cell-right">
                <div class="yd-input">
                    <input type="password" name="confirm_password"  v-model="confirm_password" placeholder="请重复密码" autocomplete="off"> 
                    <span class="yd-input-error" v-show="validated_status.confirm_password"></span> 
                    <a href="javascript:;" tabindex="-1" class="yd-input-password" @click="handleConfirmPasswordShow($event.target)" v-show="!confirmPasswordShow"></a>
                    <a href="javascript:;" tabindex="-1" class="yd-input-password yd-input-password-open" @click="handleConfirmPasswordShow($event.target)" v-show="confirmPasswordShow"></a>
                </div>
                </div>
            </div>
        </div> 
    </div>
    </form>
    <yd-button class="primary_bk" size="large"  color="#FFF" @click.native="handleRegister">一键注册</yd-button>
    <!-- 头像裁剪图 -->
    <header v-if="cropperShow" style="    background-color: rgb(255, 255, 255);
    color: rgb(228, 228, 228);
    position: fixed;
    top: 0px;
    width: 100%;
    padding-top: 0.4rem !important;
    height: 1.4rem !important;z-index:99">
        <div  style="height: 1rem;">
            <div class="yd-navbar-center">
                <span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;">拖动框进行裁剪</span>
                <span  @click="confirmCropper"  style="color: rgb(92, 92, 92);font-size: 0.3rem;padding-right: 12px;line-height: 1rem; position: fixed;right: 0px;top: 19px;">使用</span>
            </div>
        </div> 
    </header>
    <vueCropper
    v-if="cropperShow"
    ref="cropper_header"
    style="height:100%;position:fixed;z-index:100000;top:1.4rem "
    :img="option.img"
    :outputSize="option.size"
    :outputType="option.outputType"
    :canMoveBox="option.canMoveBox"
    :canMove="option.canMove"
    :autoCrop="true"
    :centerBox="option.centerBox"
    :autoCropWidth="option.autoCropWidth"
    :autoCropHeight="option.autoCropHeight"
    :fixed="option.fixed"
    :fixedNumber="option.fixedNumber"
    ></vueCropper>
</div>
</template>
<script>
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { allvalidated, validatedError } from "@/utils/validator"
import CrossLine from '@/components/cross-line/cross-line'
import { register } from '@/api/user'
import {uploadBase64} from '@/api/common'
import { setToken } from '@/utils/auth'
import storage  from  '@/utils/localstorage'
import md5 from 'js-md5'
import { VueCropper } from "vue-cropper"
import {setup} from '@/utils/socketio'
export default {
    components: {CrossLine, VueCropper},
    data() {
    return {
        option: {
            img: "",
            size: 1,
            canScale: true,
            outputType: "png",
            canMove: true,
            canMoveBox: true,
            centerBox: true,
            // 只有自动截图开启 宽度高度才生效
            autoCropWidth: 250,
            autoCropHeight: 250,
            // 开启宽度和高度比例
            fixed: true,
            fixedNumber: [4, 4]
        },
        cropperShow: false,
        nickName: "",
        email: "",
        password: "",
        confirm_password: "",
        headImg: "",
        validated_status: {
            nickName:false,
            email: false,
            password: false,
            confirm_password: false
        },
        register_option: [
        {
            name: "nickName",
            display:
            "昵称必填|昵称不能大于20位|昵称不能小于10位",
            rules: "required|max_length(20)|min_length(1)"
        },
        {
            name: "email",
            display:
            "你输入的不是合法邮箱|邮箱必填|邮箱不能大于20位|邮箱不能小于10位",
            rules: "is_email|required|max_length(20)|min_length(10)"
        },
        {
            name: "password",
            display: "密码必填|密码不能大于12位|密码不能小于6位",
            rules: "required|max_length(12)|min_length(6)"
        },
        {
            name: "confirm_password",
            display: "确认密码必填|输入的两次密码不一致",
            rules: "required|same(password)"
        },
        {
            name: "headImg",
            display: "确认头像必填",
            rules: "required"
        },
        ],
        passwordShow: false,
        confirmPasswordShow: false
    };
    },
    created() {
        window.physicsBackRouter = '/auth/login'
    },
    methods: {
        bindFile(name) {
            let btn = document.getElementById(name);
            btn.click();
        },
        bindHeaderImg() {
            let that = this;
            var reader = new FileReader();
            if(typeof event.target.files[0] !== 'undefined'){
                reader.readAsDataURL(event.target.files[0]);
                reader.onload = function() {
                    that.option.img = reader.result;
                    that.cropperShow = true;
                };
            }
        },
        confirmCropper() {
            this.$refs.cropper_header.getCropData(data => {
                //console.log( process.env)
                this.option.img = data;
                uploadBase64({ imgDatas: this.option.img})
                .then(res => {
                    this.headImg = process.env.VUE_APP_CLIENT_API+res.data.path
                })
                this.cropperShow = false;
            });
        },
        handleRegister() {
            //验证处理,返回错误信息
            var errors = allvalidated("register_form", this.register_option);
            //根据错误生成input状态
            validatedError(errors, this.validated_status);
            if (errors.length == 0) {
                let reqData = {nickName: this.nickName, email: this.email, password: md5(this.password), headImg: this.headImg}
                register(reqData).then(res=>{
                    this.password = ''
                    Toast({mes:'注册成功'})
                    //存token
                    this.$store.commit('SET_TOKEN', res.data.token)
                    setToken('token',res.data.token)
                    storage.set('user',res.data.user)
                    this.$store.commit('updateUserInfo', res.data.user)
                    setup()
                    this.$router.push('/home')
                })
            }
        },
        handlePasswordShow(dom) {
            let type = dom.parentNode.firstChild.type
            if( type == 'text'){
            dom.parentNode.firstChild.type = 'password'
            this.passwordShow = false
            }else{
            dom.parentNode.firstChild.type = 'text'
            this.passwordShow = true
            }
        },
        handleConfirmPasswordShow(dom) {
            let type = dom.parentNode.firstChild.type
            if( type == 'text'){
            dom.parentNode.firstChild.type = 'password'
            this.confirmPasswordShow = false
            }else{
            dom.parentNode.firstChild.type = 'text'
            this.confirmPasswordShow = true
            }
        }
        }
};
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/base.scss';
    @import '@/assets/scss/public.scss';
    .head_default{
        width:50px;
        height:50px;
        border-radius: 25px;
        background:$color-primary;
        line-height: 50px;
        text-align:center;
        color:#fff;
        margin-top:10px;
        margin-bottom:10px;
    }
</style>
        