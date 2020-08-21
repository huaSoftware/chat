<!--
 * @Author: hua
 * @Date: 2019-06-10 16:27:01
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-08-21 22:03:19
 -->
<template>
  <div class="login-container">
    <Vimg :img-url="require('@/assets/img/bg@2x.png')" style="width:100%;height:100%;position:fixed;z-index:1;"/>
   <div class="container">
      <Vimg :img-url="require('@/assets/img/portrait@2x.png')" style="width:90px;height:90px;position:absolute;left:50%;margin-left:-45px;margin-top:-60px"/>
      <div class="title">聊天室后台</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="name" style="background: rgba(255,255,255,1);">
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

        <el-form-item prop="pwd" style="background: rgba(255,255,255,1);">
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

        <el-form-item prop="captcha" style="background: rgba(255,255,255,1);">
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
          <Vimg id="code" :img-url="`${url}/api/v2/admin/getCode`" style="position:absolute;right:0px;width:120px;height:50px;background:#fff" @click="reGetCaptcha" />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;background:linear-gradient(0deg,rgba(255,156,0,1) 0%,rgba(249,213,25,1) 100%);
border-radius:10px;
font-size:20px;
height:50px;
font-family:Microsoft YaHei;
font-weight:400;
color:rgba(1,1,1,1);
border:none" @click.native.prevent="handleLogin">
          一键登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vimg from '@/components/Vimg'
import { validUsername, validMobile } from '@/utils/validate'
/* import SocialSign from './socialsignin' */
import { login } from '@/api/user'

export default {
  name: 'Login',
  components: {
    Vimg
  },
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
      url: process.env.VUE_APP_BASE_API,
      loginForm: {
        name: '',
        pwd: '',
        captcha: ''
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
      captcha: {
        base64blob: '',
        captchaId: ''
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
  },
  mounted() {
    
  },
  destroyed() {

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
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch((err) => {
            this.loading = false
            this.reGetCaptcha(document.getElementById('code'))
          })
        } else {
          return false
        }
      })
    },
    reGetCaptcha(event) {
      if (event.src) {
        event.src = `${this.url}/api/v2/admin/getCode?` + Math.random()
        return
      }
      event.target.src = `${this.url}/api/v2/admin/getCode?` + Math.random()
    },
    afterQRScan() {

    },
    goReset() {
      this.$router.push({ path: '/reset' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #000000;
  $dark_gray:#000000;
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $dark_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 80%;
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
          /* box-shadow: 0 0 0px 1000px #9708CC inset !important; */
          -webkit-text-fill-color: black !important;
          position: relative;
          top: 1px;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.3);
      /* background: rgba(0, 0, 0, 0.3); */
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#fff;
$dark_gray:#000000;
$light_gray:#eee;

.login-container {

  height: 100%;
  width: 100%;
  background-size: 100% 100%;
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
  .title {
    font-size: 26px;
    color: $dark_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    height:40px;
    margin-bottom: 5px;
    margin-top: 40px;
  }
}
.container{
  z-index:1000;
  display:flex;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  /* height: 320px; */
  margin-left: -210px;
  margin-top: -160px;
  flex-direction:column;
  padding-top: 20px;
  background:rgba(250,242,204,1);
  border-radius:20px;
};
.show-pwd{
  padding-left: 8px;
}
</style>
