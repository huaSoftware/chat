<!--
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 登录
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:31:00
 -->
<template>
    <div>
        <CrossLine></CrossLine>
        <form id="login_form">
        <div class="yd-cell-box">
            <div class="yd-cell">
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
                    <input @keyup.enter="handleLogin" type="password" name="password"  v-model="password" placeholder="请输入6-12位密码" autocomplete="off">
                    <span class="yd-input-error" v-show="validated_status.password"></span>  
                    <a href="javascript:;" tabindex="-1" class="yd-input-password" @click="handlePasswordShow($event.target, passwordShow)" v-show="!passwordShow"></a>
                    <a href="javascript:;" tabindex="-1" class="yd-input-password yd-input-password-open" @click="handlePasswordShow($event.target, passwordShow)" v-show="passwordShow"></a>
                </div>
                </div>
            </div> 
            </div> 
        </div>
        </form>
        <yd-button :loading="loading" class="primary_bk" size="large"  color="#FFF" @click.native="handleLogin">一键登录</yd-button>
        <router-link :to="{name: 'authRegister'}" class="right">快速注册</router-link>
    </div>
</template>
<script>
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
import utils from '@/utils/utils'
import { allvalidated, validatedError } from "@/utils/validator"
import CrossLine from '@/components/cross-line/cross-line'
import { login } from '@/socketioApi/user'
import { setToken } from '@/utils/auth'
import storage  from  '@/utils/localstorage'
import {setup} from '@/utils/socketio'
import {deleteTables} from '@/utils/indexedDB'
import md5 from 'js-md5'
export default {
    components: { CrossLine },
    data() {
    return {
        loading:false,
        email: "",
        password: "",
        confirm_password: "",
        validated_status: {
        email: false,
        password: false,
        confirm_password: false
        },
        login_option: [
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
        }
        ],
        passwordShow: false
    };
    },
    created() {
        window.physicsBackRouter = null
        //注册socketio
        setup()
    },
    mounted() {
    },
    methods: {
    handleFingerpring(){
        //开启指纹解锁
        function go() {
            this.$router.push({name:'home'})
        }
        utils.h5Plus.isFingerprint(go)
    },
    handleLogin() {
        //验证处理,返回错误信息
        var errors = allvalidated("login_form", this.login_option);
        //根据错误生成input状态
        validatedError(errors, this.validated_status);
        if (errors.length == 0) {
            this.loading = true
            login({email:this.email, password:md5(this.password)}).then(res=>{
                console.log(res)
                deleteTables()
                this.loading = false
                this.password = ''
                Toast({mes:'登录成功'})
                //存token
                this.$store.commit('SET_TOKEN', res.data.token)
                setToken('token',res.data.token)
                storage.set('user',res.data.user)
                this.$store.commit('updateUserInfo', res.data.user)
                setup()
                this.$router.push({name:'home'})
            }).catch(e=>{
                this.loading = false
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
    }
    }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
.right{
    width:100%;
    text-align: right;
    padding-right: 0.3rem;
    margin-top: 0.2rem;
    display: inline-block;
    font-size: .28rem;
}
</style>
    