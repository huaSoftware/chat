<!--
 * @Author: hua
 * @Date: 2019-06-10 16:27:01
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-10-28 21:58:06
 -->
<template>
  <div class="login-container">
   <div class="container">
      <Vimg :img-url="require('@/assets/img/portrait@2x.png')" style="-webkit-app-region:drag;width:90px;height:90px;position:absolute;left:50%;margin-left:-45px;margin-top:-50px"/>
      <div class="title">聊天室PC端</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="email" style="background: rgba(255,255,255,1);">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.email"
            placeholder="请输入用户名"
            name="email"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="pwd" style="background: rgba(255,255,255,1);">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="-webkit-app-region:no-drag;width:100%;margin-bottom:30px;background:linear-gradient(0deg,rgba(255,156,0,1) 0%,rgba(249,213,25,1) 100%);
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
import {setup} from '@/utils/socketio'
import { validUsername, validMobile } from '@/utils/validate'
import { Message } from "element-ui";
import { login } from '@/api/user'
import {ipcRenderer} from 'electron';
import utils from '@/utils/utils'
import { setToken } from '@/utils/auth'
import storage  from  '@/utils/localstorage'
import {deleteTables} from '@/utils/indexedDB'
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
        email: "",
        password: "",
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      passwordType: 'password',
      loading: false
    }
  },
  watch: {
  
  },
  created() {
    console.log(this.$store)
    setup()
  },
  mounted() {
    
  },
  destroyed() {

  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(0)
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            this.loading = false
            console.log(res)
            deleteTables()
            console.log(1)
            Message({
              message:'登录成功',
              type: "success",
              duration: 5 * 1000,
            });
            console.log(2)
            storage.set('user',res.data.user)
            this.$store.commit('user/updateUserInfo', res.data.user)
            console.log(3)
            setup()
            ipcRenderer.send('mianWindowLogin', 'ping') //给主进程发送消息“ping”
            //缺少过度效果
            console.log(4)
            this.$router.push({ name: 'Dashboard' })
          }).catch((err) => {
            this.loading = false
      
          })
        } else {
          return false
        }
      })
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
  -webkit-app-region: drag;
  margin-top: 60px;
  width: 420px;
  background-size: 100% 100%;
  overflow: hidden;
  display:flex;
  flex-direction:column;
  .login-form {
    -webkit-app-region:no-drag;
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
    font-size: 20px;
    color: $dark_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    height:30px;
    margin-bottom: 5px;
    margin-top: 50px;
  }
}
.container{
  /* z-index:1000;
  display:flex;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  height: 320px;
  margin-left: -210px;
  margin-top: -160px;
  flex-direction:column;
  padding-top: 20px; */
  background:rgba(250,242,204,1);
  border-radius:20px;
};
.show-pwd{
  padding-left: 8px;
}
</style>
