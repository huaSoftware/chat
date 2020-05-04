/*
 * @Author: hua
 * @Date: 2020-04-18 22:12:14
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-05-01 09:31:30
 */
// 必须引入的核心，换成require也是一样的。注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也许可自行调整相关源码清除全局污染
import Recorder from 'recorder-core'

// 需要使用到的音频格式编码引擎的js文件统统加载进来
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/engine/beta-amr'
import 'recorder-core/src/engine/beta-amr-engine'
// 以上三个也可以合并使用压缩好的recorder.xxx.min.js
// 比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持

// 可选的扩展支持项
import 'recorder-core/src/extensions/waveview'

// 简单控制台直接测试方法：在任意(无CSP限制)页面内加载Recorder，加载成功后再执行一次本代码立即会有效果，import("https://xiangyuecn.github.io/Recorder/recorder.mp3.min.js").then(function(s){console.log("import ok")}).catch(function(e){console.error("import fail",e)})

var rec
/** 调用open打开录音请求好录音权限**/
export var recOpen = function(success) {
  // 一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
  rec = Recorder({
    type: 'amr',
    sampleRate: 16000,
    bitRate: 16, // mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
    onProcess: function(
      buffers,
      powerLevel,
      bufferDuration,
      bufferSampleRate,
      newBufferIdx,
      asyncEnd
    ) {
      // 录音实时回调，大约1秒调用12次本回调
      // 可利用extensions/waveview.js扩展实时绘制波形
      // 可利用extensions/sonic.js扩展实时变速变调，此扩展计算量巨大，onProcess需要返回true开启异步模式
    }
  })

  // var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
  rec.open(
    function() {
      // 打开麦克风授权获得相关资源
      // dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
      // rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程

      success && success()
    },
    function(msg, isUserNotAllow) {
      // 用户拒绝未授权或不支持
      // dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
      console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
    }
  )
}

/** 开始录音**/
export function recStart() {
  // 打开了录音后才能进行start、stop调用
  rec.start()
}

/** 结束录音**/
export function recStop(callback) {
  rec.stop(
    function(blob, duration) {
      console.log(
        blob,
        (window.URL || webkitURL).createObjectURL(blob),
        '时长:' + duration + 'ms'
      )
      rec.close() // 释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
      rec = null

      // 已经拿到blob文件对象想干嘛就干嘛：立即播放、上传

      /** * 【立即播放例子】 ***/
      /* var audio = document.createElement("audio");
      audio.controls = true;
      document.body.appendChild(audio);
      //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
      audio.src = (window.URL || webkitURL).createObjectURL(blob);
      audio.play(); */
      callback(blob)
      /*  var BenzAMRRecorder = require("benz-amr-recorder");
      var amr = new BenzAMRRecorder();
      amr
        .initWithUrl((window.URL || webkitURL).createObjectURL(blob))
        .then(function() {
          amr.play();
        });
      amr.onEnded(); */
    },
    function(msg) {
      console.log('录音失败:' + msg)
      rec.close() // 可以通过stop方法的第3个参数来自动调用close
      rec = null
    }
  )
}

// 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调
/* 伪代码：
function createDelayDialog(){
    if(Is Mobile){//只针对移动端
        return new Alert Dialog Component
            .Message("录音功能需要麦克风权限，请允许；如果未看到任何请求，请点击忽略~")
            .Button("忽略")
            .OnClick(function(){//明确是用户点击的按钮，此时代表浏览器没有发起任何权限请求
                //此处执行fail逻辑
                console.log("无法录音：权限请求被忽略");
            })
            .OnCancel(NOOP)//自动取消的对话框不需要任何处理
            .Delay(8000); //延迟8秒显示，这么久还没有操作基本可以判定浏览器有毛病
    };
};
*/

// 这里假设立即运行，只录3秒，录完后立即播放，本段代码copy到控制台内可直接运行
/* recOpen(function() {
  recStart();
  setTimeout(recStop, 3000);
}); */
