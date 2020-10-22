<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:36
 * @description: 广告页
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:15:04
 -->
<template>
  <!-- 广告页 -->
  <div class="content">
    <!-- 右上角离开按钮 -->
    <div class="leave" v-show="goClickStatus" @click="clickGoHome">{{second}} 跳过</div>
    <!-- 文字区 -->
    <div class="vertical_wrapper">
      <div class="vertical_left">穷则独善其身</div> 
      <div class="vertical_right">达则兼济天下</div> 
    </div>
    <!--白底图-->
    <div style="width:100%;height:100%;position:absolute;z-index:997;background:#fff!important;">
      <img class="ad_bottom wrapper" src="@/assets/img/ad/ad_bottom_750_1334.png" />
    </div>
    <!-- 广告图片 -->
    <!-- 裁剪图 -->
    <!-- <vueCropper 
    v-if="vueCropperStatus"
    ref="cropper" 
    :img="option.img"
    :outputSize="option.size"
    :outputType="option.outputType"
    :canMoveBox="option.canMoveBox"
    :canMove="option.canMove"
    :autoCrop="true"
    :autoCropWidth="option.autoCropWidth"
    :autoCropHeight="option.autoCropHeight"
    @imgLoad="handle"
    ></vueCropper>-->
    <!-- 裁剪过的广告图 -->
    <!-- <img  style="position:absolute;z-index:998;top:0px;" :src="img">
    <img v-if="adBottomStatus" class="ad_bottom" src="static/img/ad/ad_bottom_750_1334.png" >-->
  </div>
</template>
<script>
import { VueCropper } from "vue-cropper";
import storage from "@/utils/localstorage";
export default {
  data() {
    return {
      adBottomStatus: false,
      goClickStatus: false,
      vueCropperStatus: true,
      goHomeTime: null,
      img: "",
      second: 3,
      option: {
        img: "@/assets/img/ad/ad1.png",
        size: 1,
        outputType: "png",
        canMove: false,
        canMoveBox: false,
        autoCropHeight: "",
        autoCropWidth: ""
      }
    };
  },
  components: { VueCropper },
  created() {
    //设置裁剪框大小
    /*  var adImg = ["static/img/ad/ad1.png", "static/img/ad/ad2.png", "static/img/ad/ad3.png"]; 
        this.option.img = adImg[Math.floor(Math.random()*adImg.length)]
        //console.log(this.option.img)
        let clientWidth = document.body.clientWidth
        let clientHeight = document.body.style.height || document.body.clientHeight || document.documentElement.clientHeight
        ////console.log(clientHeight)
        ////console.log(clientWidth)
        let limitHeight = clientWidth * 1920/ 1080
        let limitWidth =  clientHeight * 1080/ 1920
        if(limitHeight< document.body.clientHeight){
            this.option.autoCropHeight = limitHeight
            this.option.autoCropWidth = limitHeight * clientWidth/clientHeight
            
        }else{
            this.option.autoCropWidth = limitWidth
            this.option.autoCropHeight = limitWidth * clientHeight/clientWidth
        }
        //是否显示底部logo
        let ratio = document.body.clientHeight / document.body.clientWidth
        if(ratio >= 1.8){
            this.adBottomStatus = true
        } */
  },
  mounted() {
    this.goHomeTime = window.setInterval(() => {
      this.goClickStatus = true;
      this.goHome();
    }, 2000);
  },
  //注意销毁掉监听，不然报错
  beforeDestroy() {
    if (this.goHomeTime) {
      window.clearInterval(this.goHomeTime);
    }
  },
  methods: {
    handle() {
      this.$refs.cropper.getCropData(data => {
        this.img = data;
        this.goClickStatus = true;
        this.vueCropperStatus = false;
        this.goHomeTime = window.setInterval(() => {
          this.goHome();
        }, 1000);
      });
    },
    goHome() {
      this.second = this.second - 1;
      if (this.second == 0) {
        this.clickGoHome();
      }
    },
    clickGoHome() {
      if (!localStorage.token) {
        this.$router.push({ name: "authLogin" });
      } else {
        this.$router.push({ name: "home" });
      }
    }
  }
};
</script>
    
<style lang="scss" scoped>
@import "./scss/ad";
</style>
