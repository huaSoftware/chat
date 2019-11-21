<!--
 * @Author: hua
 * @Date: 2019-06-10 16:26:59
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-20 20:19:52
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {setDown, setup, setupListen} from '@/utils/socketio'
export default {
  name: 'App',
  data() {
    return {
      hiddenTime: 0,
    }
  },
  created() {
    setup()
    //每2秒检测是否监听断开
    /* setInterval(()=>{
      if(window.apiSocket !== undefined){
        if( window.apiSocket._callbacks.$beg == undefined ||
            window.apiSocket._callbacks.$chat == undefined ||
            window.apiSocket._callbacks.$connect == undefined ||
            window.apiSocket._callbacks.$connecting == undefined ||
            window.apiSocket._callbacks.$disconnect == undefined ||
            window.apiSocket._callbacks.$groupRoom == undefined ||
            window.apiSocket._callbacks.$join == undefined ||
            window.apiSocket._callbacks.$leave == undefined ||
            window.apiSocket._callbacks.$room == undefined ||
            window.apiSocket._callbacks.$send == undefined
        ){
          setupListen()
        }
      }
    },5000) */
    document.addEventListener('visibilitychange',()=> {
      if(document.visibilityState=='hidden') {
        this.hiddenTime = new Date().getTime()	//记录页面隐藏时间
      }else{
        let visibleTime = new Date().getTime();
        if((visibleTime-this.hiddenTime)/1000>10){	//页面再次可见的时间-隐藏时间>10S,重连
          setDown()
          console.log('主动关闭连接后重连');
          setTimeout(()=> {
            setup()    //打开连接，使用的vuejs，这是socketio的连接方法
          },1500);    //1.5S后重连
        }else{
          console.log('还没有到断开的时间')
        }
      }
    });
  },
}
</script>
