/*
 * @Author: hua
 * @Date: 2020-05-18 09:00:54
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-05-18 09:14:34
 */ 
var reader = new FileReader();
//每次切分的大小
const chunkSize = 16384;

//通过setTimeout函数，每隔一段时间调用MediaRecorder的start和stop
//注意这个时间不宜太小，“太小”是相对于stop和start之间的这个间隔来说的
//如果过小就会使得stop和start之间的这段间隔变得明显
//setTimeout(RecordLoop,1000);
 
export function RecordLoop(mediaRecorder){
	mediaRecorder.stop();
	mediaRecorder.start();
	setTimeout(RecordLoop,1000);
}
 
//因为每次发送的大小有限制，所以需要每次将blob切分成几段发送
export function readSlice(file,file_offset){
    //文件传输开始前，先发送文件长度信息
    if(file_offset==0){
        //datachannel发送文件总长度
        var fileinfo = {
            "filesize":file.size
        }
        datachannel.send(JSON.stringify(fileinfo));
        //接收方只有在收到fileinfo之后才会开始收集传输到的数据
    }			
    //切分文件
	var sliceOfFile = file.slice(file_offset,file_offset+chunkSize);
    //读取完成后触发onloadend事件发送给接收方
	reader.readAsArrayBuffer(sliceOfFile);
	return file_offset+chunkSize;
}
 
export function send (mediaRecorder){
    reader.onloadend = function(event){
        //发送
        datachannel.send(reader.result);
        //检查是否发送完成
        if(offset<file_ToSend.size){
            offset = readSlice(file_ToSend,offset);
        }
    }
    
    mediaRecorder.ondataavailable = function(e) {
        var arr_temp = [];
        arr_temp.push(e.data);
        var blob_temp = new Blob(arr_temp,{'type':'video/webm; codecs=opus,vp8'});
                    
        var file_ToSend = blob_temp;
        var offset = 0;
        //var arraybuffer_toSend;
        //当数据可用时，readSlice切分blob并且send
        offset = readSlice(file_ToSend,offset);
    }
}

//接收

//当前正在接收的file的总size
var now_file_size = null;
//已经收到的size
var now_received_size = 0;
//用于拼接成blob
var arr = [];
//DataChannel收到消息
export function dc_receive_message(event){
	if(typeof(event.data)=='string'){
	    //重置
	    now_file_size = null;
	    now_received_size = 0;
	    arr = [];
				
	    var obj = eval ("(" + event.data + ")");
	    console.log('get file size : '+obj.filesize);
	    now_file_size = obj.filesize;
	}else{
		if(now_file_size != null){
            arr.push(event.data);
    
            //更新接收到的size
            //blob是size，arraybuffer是byteSize
            now_received_size += event.data.byteLength;		
                        
            if(now_received_size==now_file_size){
                var blob = new Blob(arr,{'type':'video/webm; codecs=opus,vp8'});
    
                //当FileReader读取完成后，将其的播放
                reader.onloadend = function(e){
                    sourcebuffer.appendBuffer(reader.result);
                }
                reader.readAsArrayBuffer(blob);
    
                //组装完成后清空记录
                now_file_size = null;
                now_received_size = 0;
                arr = [];
    
                sourcebuffer.addEventListener('updateend',function(event){
                    if(!sourcebuffer.updating){
                        //设置持续时间
                        try{
                            mediasource.duration = 5;//初始加载5s
                        }catch(e){
                            console.log(e);
                        }
                    }
                });
                            
                if (RemoteVideo.buffered.length && RemoteVideo.buffered.end(RemoteVideo.buffered.length-1) - RemoteVideo.buffered.start(0) > buffered_time_limit){
                    console.log('clear buffer from 0 to '+ (RemoteVideo.buffered.end(RemoteVideo.buffered.length-1) - buffered_time_limit));
                    sourcebuffer.remove(0, RemoteVideo.buffered.end(RemoteVideo.buffered.length-1) - buffered_time_limit);           
                }
            }
                        
        }
    }
}