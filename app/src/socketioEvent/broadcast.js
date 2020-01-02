/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:23
 * @description: 
 * @LastEditors  : hua
 * @LastEditTime : 2020-01-02 21:22:11
 */
import store from '../store'
import router from '../router'
import {Loading} from 'vue-ydui/dist/lib.rem/dialog'
import {rsaEncode, response} from '@/utils/socketio'
export default function broadcast(data, method){
    if(!store.getters.token){
        window.tryBroadcastLinkCount = 0
        clearTimeout(window.broadcastTimeOut)
        Loading.close()
    }
    //响应超时
    window.broadcastTimeOut = setTimeout(()=>{
        if(method == 'join'){
            Loading.open(`广播尝试第${window.tryBroadcastLinkCount+1}次链接中...`)
            if(window.tryBroadcastLinkCount<3){
                send('join', {}, 'broadcast')
                window.tryBroadcastLinkCount++
            }else{
                window.tryBroadcastLinkCount = 0
                clearTimeout(window.broadcastTimeOut)
                Loading.close()
                router.push({
                    name: 'connectLose',
                    query: {text:"广播连接已断开"}
                })
            }
        }
        if(method == 'leave'){
            Loading.open(`广播退出超时,尝试第${window.tryBroadcastLinkCount+1}次退出中...`)
            if(window.tryBroadcastLinkCount<3){
                send('leave', {}, 'broadcast')
                window.tryBroadcastLinkCount++
            }else{
                window.tryBroadcastLinkCount = 0
                clearTimeout(window.broadcastTimeOut)
                Loading.close()
                router.push({
                    name: 'connectLose',
                    query: {text:"广播连接已断开"}
                })
            }
        }
        if(method == 'input'){
            if(window.tryBroadcastLinkCount<3){
                window.tryBroadcastLinkCount++
            }else{
                window.tryBroadcastLinkCount = 0
                clearTimeout(window.broadcastTimeOut)
                Loading.close()
                router.push({
                    name: 'connectLose',
                    query: {text:"输入监听连接已断开"}
                })
            }
        }
    },5500)
    data['type'] = store.getters.NOTIFY
    let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
    console.log("广播："+method, "秘钥："+encryptStr)
    window.apiSocket.emit(method, encryptStr, (recv)=>{
        response(recv).then(res=>{
            if(res.data.action == 'leave'){	
                clearTimeout(window.broadcastTimeOut)
                Loading.close()
            }
            if(res.data.action == 'join'){
                clearTimeout(window.broadcastTimeOut)	
                Loading.close()			
            }
            if(res.data.action == 'input'){
                clearTimeout(window.broadcastTimeOut)	
                Loading.close()		
            }
        }).catch(e=>{
            //服务器出错
        })
    })
}