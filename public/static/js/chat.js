// 用于聊天室解析图片
function magPic(event) {
    var imgSrc = event.target.src
    console.log(imgSrc)
    var backDropEl = document.createElement("div");
    backDropEl.setAttribute('id', 'chat-backdrop');
    backDropEl.setAttribute('onclick', 'closeChatBdEl()');
    // 添加到body节点
    document.body.appendChild(backDropEl);
    var imgEl = document.createElement('img')
    imgEl.setAttribute('class', 'chat_img');
    imgEl.src = imgSrc
    var chatBdEl = document.getElementById("chat-backdrop");
    // 添加到遮罩节点下
    chatBdEl.appendChild(imgEl);
  }
  
  // 关闭聊天遮罩
  function closeChatBdEl () {
    var chatBdEl = document.getElementById("chat-backdrop")
    chatBdEl.parentNode.removeChild(chatBdEl)
  }
  
  //解析收藏
  function goHref(value){
    window.location.href = value
  }
  
  //下载文件
  function downLoad(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }