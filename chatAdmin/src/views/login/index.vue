<!--
 * @Author: hua
 * @Date: 2019-06-10 16:27:01
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2019-10-11 10:10:02
 -->
<template>
  <div class="login-container">
    <canvas id="c" />
    <div class="container">
      <div class="title">聊天室后台</div>
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
          <img id="code" :src="`${url}/api/v2/admin/getCode`" style="position:absolute;right:0px;width:120px;height:50px;background:#fff" @click="reGetCaptcha">
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername, validMobile } from '@/utils/validate'
/* import SocialSign from './socialsignin' */
import { login } from '@/api/user'

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
      url: process.env.VUE_APP_BASE_API,
      bg: {/* backgroundImage: "url(" + require("@/../static/img/login/school.png") + ")" */},
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
    this.init()
  },
  destroyed() {

  },
  methods: {
    init() {
      // Customize these...
      var n = 99
      var speed = 1
      var wind = 500
      var windVariance = 1.5 // 1 = no variance

      // ...not these
      var c = document.getElementById('c')
      var ctx = c.getContext('2d')
      var cw = (c.width = window.innerWidth)
      var ch = (c.height = window.innerHeight)
      var img = new Image(64, 64)
      var particles = []
      var particleNumber = 0
      var Particle = function(index) {
        this.size = rand(5, 10) // default (90% background) size, duration, & alpha
        this.dur = (15 - this.size) / speed //
        this.alpha = rand(0.25, 0.75) //
        if (index < n / 100) { // 1% in the foreground...
          this.size = rand(150, 200)
          this.dur = this.dur / 4
          this.alpha = this.alpha / 3.3
        } else if (index < n / 10) { // ...then 9% in the middleground
          this.size = rand(19, 33)
          this.dur = this.dur / 2.5
          this.alpha = this.alpha / 1.5
        }
        var rot = -rand(3, 5)
        if (index % 4 == 0) rot = -rot
        this.draw = function() {
          ctx.translate(this.x, this.y)
          ctx.rotate(rot * this.progress)
          ctx.globalAlpha = this.alpha
          ctx.drawImage(img, -this.size / 2, -this.size / 2, this.size, this.size)
          ctx.rotate(-rot * this.progress)
          ctx.translate(-this.x, -this.y)
        }
      }

      function setParticle(p) {
        particleNumber++
        var _tl = new TimelineMax()
          .fromTo(p, p.dur, {
            x: rand(-Math.abs(wind), (cw + Math.abs(wind))),
            y: -p.size,
            progress: 0
          }, {
            x: '+=' + String(rand(wind / windVariance, wind * windVariance)),
            y: ch + p.size,
            progress: 1,
            ease: Power0.easeNone,
            onComplete: function() { setParticle(p) }
          })
        if (particleNumber < n) _tl.seek(p.dur * rand()) // fast forward on first run
      }

      // First run
      for (var i = 0; i < n; i++) {
        particles.push(new Particle(i))
        setParticle(particles[i])
      }

      TweenMax.ticker.addEventListener('tick', function() {
        ctx.clearRect(0, 0, cw, ch)
        for (var i = 0; i < n; i++) {
          particles[i].draw()
        }
      })

      window.addEventListener('resize', function() {
        particleNumber = 0
        cw = (c.width = window.innerWidth)
        ch = (c.height = window.innerHeight)
        for (var i = 0; i < n; i++) {
          TweenMax.killTweensOf(particles[i])
          setParticle(particles[i])
        }
      })

      function rand(min = 0, max = 1) {
        return min + (max - min) * Math.random()
      }

      img.src = 'https://www.python.org/static/img/python-logo-large.c36dccadd999.png?1543670309'// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAulBMVEVHcEz////+/v7////+/v79/f3////x8fH9/f3+/v7+/v7////+/v7////////////////////////////////////////////////+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+MnUWcAAAAPnRSTlMACQ4GBAoWAQMCDRMQJSIfOlQICxgdSkFyG09hXDcrKUeMLZKgsmmnPoIaL2aHWH4xbaw0d0S8wXu3m5cymMmy7QsAAAVDSURBVHgBzZd3g6JKEMQP99BbzoSYs5jFHDbq9/9ar6qb4aHLxr+uX7jYP6pqmKHn179VGa37sDLyO1/u/aW9f1C/tfAzYr4GYa+23sVLMF9h8OFhd6lkWZZt2/h/qSQMCvmEQNt/+ES0eg4qlUo5KcfxPMvib3+KwOPZz+5UNpv9GxZ+CggZnyDon+JtL4XudDpdDitNCBCwEmbxTgBID97xeHSXF41KQapSqTTKZTBSjk3E72SCAJCe5aXwdHbnc6by+UJlAR1AeEZFAgL9EOA57K8Ucrle1/cDlu/3cjkwFGFzSeTNeBsB+m3tz+d6fnA+dIqszuEc+D0gGjSS9ZAmjdz/yrwFiIEy+wN0z2a12ulUq81mxc6ZCBgBwrETfWS4BBYFNPK57hbtp361Wm028b/+qWYQDfrwiKCPWwATSC8KeH6nWOtXm67rrtdr1wWlbxANRqEiqOEWkKKAnn9gv+u22y2pdttVROAzChFhqYbMdQSOJNDbdmb9prtut5aTyW63myyXLUHMioeAPpCEEO6o4RYAB91z8VR112jf1etHVL2+A2LdrJ5mRfgAIa0EJhkH2BqBLwLay139+LTZzOfzzdNREC59HEJC1ivRxK0CRhAQsG5Ndsen+Wo1GAxWKzCIgIiIIEn+ZgoJgFpVBKB/MJQaAHGsT1prVwg5SdKhiY8Axw36X19Yr0RAhBLOXRAogSuRiS8jQ8znQgAEDIaXEWo6GhGhhCZy2NIEcyQgc/0elAshYCKAl9F0ut/vp9PRCwlw4Tb7M5pYpNVDBMhEAN8AVoPXEdrHqD0IryDsllgLlYClZIyxEO6wjgyhe5j1xcJqCAD6n5+fx2PVcKSJU/HQzf3v4Wo3Sop4kZrr5Q4WXgh4fnh4AGIPwuqpTgmzDj0o4P4a4EQhtHbH+eACAPofH4GAhldKQArigesQBzAEXcgcPTAEhDiajp/RTwJyEAni4cwQuJBXAB5pXMheIB4YwgssAIASCcPBhh6wDt1bAD2Q4PxNV3K+8YAQmEEEeAVg8iHgDhIQ41YlbFYxD2EIBpB7A5AvCyWUIwlPRkIsxbgCz7oGyLnopcxKtkMJJLA/buGcAIjtqHgKF32X0B+9CM0+VsEA9FWOr4SHU8VI4EKQAAQ2BB086asY9Pgi2SXZC/GiBLMQ3BDHDQmjKYvv8oYvUrXWCXKFchKAO6IUe59pAjviZYRiPx0wgo7PveDEt0L8aNQ9qVsKK8Fj5XK58FChgDUiQIaNhAz1ZVAPfBd0V/Ng4sk2YH892s4EwMEtQHc1Pw/YETShZ+t8hQqPxaY4YAQez0TT+OZ01uMdBDnecb4/PbE/dp6YvZjgwYOE6Hxv8wPD2u3YHwpIdhDf1QuYOHdq/Ma18JFCLVvSTwFcg6wNB8mTin5l9SMnX+l1u43mdnvNfp5nZismAbgpS3ZsUCCi6bKa8nXsBL08IqSDhAjMsWBzVCEhOBRnNc4aMmic5APNBLAGpUQBGiNnDRIwbPhnjEpm2MHAFIiBv3oWJANEg+V50by1PRw6HLg6ncPWlwFBBHwMgAtOnGUOjDLxbbfbANOaGZQcAmjhI4IOnUCAIaUD4yKacbgTk1PQsddCEBx7G2Tk0YyZlXMvB072y1ZOJpjB23IgAkbKjUajwlpczbz3H96b7nnzsGwgyDClk7stApjhBwhzfdD7gyk+nZP/Z/3GB0RQhm17nqPl2XZJp+XPAGY9yOAdSquEbrZzRPwKgCrkHkaMFrvjd5/PEfFrJJvNRfK7d1lzk9X6+ZWY19t/sP4DoePqp9agWnMAAAAASUVORK5CYII=";
    },
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
$dark_gray:#e5edf1;
$light_gray:#eee;

.login-container {

  height: 100%;
  width: 100%;
  background-image: linear-gradient( 135deg, #FFDB01 10%, #0E197D 100%);
  //background-color: $bg;
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
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
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
  background-image: linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%);
};
.show-pwd{
  padding-left: 8px;
}
</style>
