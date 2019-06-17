<!--
 * @Author: hua
 * @Date: 2019-06-10 16:27:01
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-06-10 19:32:55
 -->
<template>
  <div class="login-container">
    <div class="top-container">
      <div class="bg" :style="bg">
        <!--<img src="/static/img/login/school.png">-->
      </div>
      <div class="mian-content">
        <div class="top">
        </div>
        <div class="middle">
          <span>一款基于socketio开发, 精简的一款聊天室</span>
         <!--  <p>寓教于乐，和气生才</p> -->
        </div>
       <!--  <div class="bottom">
          <p>欢迎登录【聊天】PC管理后台</p>
        </div> -->
      </div>

    </div>
    <div class="bottom-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="name">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.name"
            placeholder="请输入用户名"
            name="name"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="pwd">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.pwd"
            :type="passwordType"
            placeholder="请输入密码"
            name="pwd"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item prop="captcha">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.captcha"
            type="text"
            placeholder="动态验证码"
            name="captcha"
            auto-complete="on"
          />
         <img :src="`${url}/api/v2/admin/getCode`" style="position:absolute;right:0px;width:120px;height:50px;background:#fff" @click="reGetCaptcha"/>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
         登录
        </el-button>
      </el-form>
    </div>
    <!-- <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
    </el-dialog> -->
  </div>
</template>

<script>
import { validUsername,validMobile } from '@/utils/validate'
/* import SocialSign from './socialsignin' */
import {login} from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('用户名小于6位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码小于6位'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('验证码小于5位'))
      } else {
        callback()
      }
    }
    return {
      url:process.env.VUE_APP_BASE_API,
      bg:{/* backgroundImage: "url(" + require("@/../static/img/login/school.png") + ")" */},
      loginForm: {
        name: '',
        pwd: '',
        captcha:''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateUsername }],
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      captcha:{
        base64blob:'',
        captchaId:'',
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    console.log(this.$store)
    // window.addEventListener('hashchange', this.afterQRScan)
    /* getCaptcha().then(res=>{
      this.captcha=res.data
    }) */
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path:  '/' })
          }).catch((err) => {
            console.log(err);
            this.$message({
              message: err
            })
            this.loading = false
            //this.reGetCaptcha()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reGetCaptcha(event){
      event.target.src = `${this.url}/api/v2/admin/getCode?`+Math.random()
       /*  getCaptcha().then(res=>{
        this.captcha=res.data
      }) */
    },
    afterQRScan() {

    },
    goReset(){
      this.$router.push({ path:'/reset' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px rgba(28,36,74, 0.5) inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#fff;
$dark_gray:#e5edf1;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display:flex;
  flex-direction:column;
  .login-form {
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    z-index:100;
    width:360px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    float:left;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size:18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
};

.top-container{
  width:100%;
  flex:1;
  position: relative;
  .bg{
    z-index: 9;
    height:100%;
    justify-content:center;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .bg img{
    width:100%;
  };
  .mian-content{
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
  }
  .mian-content{
    background:#283443;
    color:#fff;
    .top,.middle{
      width:80%;
      margin:auto;
    }
    .top{
      display:flex;
      align-items:center;
      justify-content: space-between;
      padding-top:50px;
      font-size:16px;
      .logo img{
        width:200px;
      };
      .right-src a{
        margin-right:20px;
        display:inline-block;
      }
      .right-src a:last-child{
        margin-right:0;
      }
    };
    .middle,.bottom{
      text-align:center;
    };
    .middle{
      p{
        font-size:40px;
      };
      span{
        font-size:16px;
      }
    };
    .bottom{
      position:absolute;
      bottom:0;
      width:100%;
    };
  };
};
.bottom-container{
  z-index:1000;
  display:flex;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  height: 320px;
  margin-left: -210px;
  margin-top: -160px;
};
</style>
