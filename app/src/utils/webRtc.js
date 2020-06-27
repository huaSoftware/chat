/*
 * @Author: hua
 * @Date: 2020-06-21 14:33:32
 * @description: 视频聊天
 * @LastEditors: hua
 * @LastEditTime: 2020-06-27 17:39:21
 */ 
import store from "../store";
import {Loading, Toast} from 'vue-ydui/dist/lib.rem/dialog'
import { chatSend } from "@/socketIoApi/chat";

export function init(){
  window.debug = true;
  //先定义stun服务器
  window.stun_url = 'stun:stun.l.google.com:19302';
  //navigator.getUserMedia = navigator.getUserMedia|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.localVideo = document.getElementById('localvideo');
  window.remoteVideo = document.getElementById('remotevideo');
  window.localStream = null;
  window.peerConnection = null;
  window.peerStarted = false;
  window.mediaConstraints = { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } };
}
// ----------------- handshake --------------
window.iceSeparator = '------ ICE Candidate -------';
window.CR = String.fromCharCode(13);

export function onOffer(evt) {
  console.log("Received offer...")
  console.log(evt);
  setOffer(evt);
  sendAnswer(evt);
  peerStarted = true;  // ++
}

export function onAnswer(evt) {
  console.log("Received Answer...")
  console.log(evt);
  setAnswer(evt);
}

export function onCandidate(evt) {
  var candidate = new RTCIceCandidate({ sdpMLineIndex: evt.sdpMLineIndex, sdpMid: evt.sdpMid, candidate: evt.candidate });
  console.log("Received Candidate...")
  console.log(candidate);
  peerConnection.addIceCandidate(candidate);
}

function sendSDP(sdp) {
  var text = JSON.stringify(sdp);
  console.log("---sending sdp text ---");
  console.log(text);
  // send via socket
  //socket.emit('mess', sdp);
  chatSend({
    data: {
      msg: JSON.stringify(sdp),
      room_uuid: store.getters.currentRoomUuid,
      type: store.getters.CHAT_VIDEO,
      save_action: store.getters.LOCAL
    }
  });
}

function sendCandidate(candidate) {
  var text = JSON.stringify(candidate);
  console.log("---sending candidate text ---");
  console.log(text);
  // send via socket
  //socket.emit('mess', candidate);
  chatSend({
    data: {
      msg: JSON.stringify(candidate),
      room_uuid: store.getters.currentRoomUuid,
      type: store.getters.CHAT_VIDEO,
      save_action: store.getters.LOCAL
    }
  });
}

// ---------------------- video handling -----------------------
// start local video
export function startVideo() {
  // navigator.webkitGetUserMedia({video: true, audio: false},
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
    then(stream=> { // success
      console.log()
      //d('startVideo localStream = '+stream);
      console.log(localVideo)
      console.log('startVideo success');
      localStream = stream;
      localVideo.srcObject = stream;
      localVideo.play();
      localVideo.volume = 0;
      window.localVideo.style.display="block";
      chatSend({
        data: {
          msg: JSON.stringify({type:"start"}),
          room_uuid: store.getters.currentRoomUuid,
          type: store.getters.CHAT_VIDEO,
          save_action: store.getters.LOCAL
        }
      })
      window.videoStreamTime = setTimeout(()=>{
        Loading.close("");
        Toast({mes:'连接超时',icon: 'error'})
        stopVideo();
        hangUp();
        
      },store.state.codeData.TIME.TIME_OUT.value)
      Loading.open("正在连接...");
    }).catch ((error) =>{ // error
      console.log('startVideo fail ' + error.code);
      console.log('error : ' + JSON.stringify(error));
      console.error('An error occurred: [CODE ' + error.code + ']');
      return;
    })
}

export function agreeStartVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
    then(stream=> { // success
      console.log()
      //d('startVideo localStream = '+stream);
      console.log(localVideo)
      console.log('startVideo success');
      localStream = stream;
      localVideo.srcObject = stream;
      localVideo.play();
      localVideo.volume = 0;
      window.localVideo.style.display="block";
      connect();
      Loading.open("正在连接...");
  
    }).catch ((error) =>{ // error
      console.log('startVideo fail ' + error.code);
      console.log('error : ' + JSON.stringify(error));
      console.error('An error occurred: [CODE ' + error.code + ']');
      return;
    })
}

// stop local video
export function stopVideo() {
  console.log(localStream)
  localStream.getTracks().forEach(function (track) {
    track.stop();
  });
  //window.localVideo.stop();
  window.localVideo.src = "";
  window.localVideo.style.display="none";
  window.remoteVideo.src = "";
  window.remoteVideo.style.display="none";
}

// ---------------------- connection handling -----------------------
function prepareNewConnection() {
  //建立链接
  var pc_config = { "iceServers": [{ "urls": stun_url }] };
  var peer = null;
  try {
    peer = new webkitRTCPeerConnection(pc_config);
  } catch (e) {
    console.log("Failed to create peerConnection, exception: " + e.message);
  }

  // send any ice candidates to the other peer
  peer.onicecandidate = function (evt) {
    if (evt.candidate) {
      console.log(evt.candidate);
      //发送候选人
      sendCandidate({
        type: "candidate",
        sdpMLineIndex: evt.candidate.sdpMLineIndex,
        sdpMid: evt.candidate.sdpMid,
        candidate: evt.candidate.candidate
      }
      );
    } else {
      console.log("End of candidates. ------------------- phase=" + evt.eventPhase);
    }
  };

  console.log('Adding local stream...');
  peer.addStream(localStream);

  peer.addEventListener("addstream", onRemoteStreamAdded, false);
  peer.addEventListener("removestream", onRemoteStreamRemoved, false)
  peer.oniceconnectionstatechange = function(event) {
    if (peer.iceConnectionState === "failed" ||
      peer.iceConnectionState === "disconnected" ||
      peer.iceConnectionState === "closed") {
      // Handle the failure
      Loading.close("");
      Toast({mes:'短接断开',icon: 'error'})
      stopVideo();
      hangUp();
    }
  };
  // when remote adds a stream, hand it on to the local video element
  function onRemoteStreamAdded(event) {
    Loading.close();
    Toast({mes:'连接成功',icon: 'success', timeout: 3000})
    clearTimeout(window.videoStreamTime);
    console.log("Added remote stream");
    remoteVideo.srcObject = event.stream;
    window.remoteVideo.style.display="block";
  }

  // when remote removes a stream, remove it from the local video element
  function onRemoteStreamRemoved(event) {
    console.log("Remove remote stream");
    remoteVideo.src = "";
  }

  return peer;
}

function sendOffer() {
  peerConnection = prepareNewConnection();
  peerConnection.createOffer(function (sessionDescription) { // in case of success
    peerConnection.setLocalDescription(sessionDescription);
    console.log("Sending: SDP - Offer");
    console.log(sessionDescription);
    sendSDP(sessionDescription);
  }, function () { // in case of error
    console.log("Create Offer failed");
  }, mediaConstraints);
}

function setOffer(evt) {
  if (peerConnection) {
    console.error('peerConnection alreay exist!');
    return;
  }
  peerConnection = prepareNewConnection();
  peerConnection.setRemoteDescription(new RTCSessionDescription(evt));
}

function sendAnswer(evt) {
  console.log('sending Answer. Creating remote session description...');
  if (!peerConnection) {
    console.error('peerConnection NOT exist!');
    return;
  }

  peerConnection.createAnswer(function (sessionDescription) { // in case of success
    peerConnection.setLocalDescription(sessionDescription);
    console.log("Sending: SDP - Answer");
    console.log(sessionDescription);
    sendSDP(sessionDescription);
  }, function () { // in case of error
    console.log("Create Answer failed");
  }, mediaConstraints);
}

function setAnswer(evt) {
  if (!peerConnection) {
    console.error('peerConnection NOT exist!');
    return;
  }
  peerConnection.setRemoteDescription(new RTCSessionDescription(evt));
}

// -------- handling user UI event -----
// start the connection upon user request
export function connect() {
  //连接前先呼叫用户，让对方用户确认连接（对方用户开启视频），然后用户回复
  console.log('try connect. peerStarted:' + peerStarted + ' localStream:' + localStream);
  console.log(!peerStarted, localStream)
  console.log(Boolean(localStream));
  
  //if (!peerStarted && localStream && socketReady) { // **
    //if (!peerStarted && localStream) { // --
    console.log('try sendOffer.');
    sendOffer();
    peerStarted = true;
  //} else {
  //  alert("Local stream not running yet - try again.");
  //}
}

// stop the connection upon user request
export function hangUp() {
  console.log("Hang up.");
  stop();
}

export function stop() {
  //peerConnection.close();
  peerConnection = null;
  peerStarted = false;
}
