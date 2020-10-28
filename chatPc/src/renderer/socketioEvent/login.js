/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:57
 * @description: 登录与退出事件
 * @LastEditors: hua
 * @LastEditTime: 2020-10-28 21:32:32
 */
import store from '../store'
import router from '../router'
import {rsaEncode} from '@/utils/socketio'
import { Message } from "element-ui";
/**  
 * 登录与退出
 * 用于记录在线状态
 * 
 * @param object data
 * @param string method
 */
export default function loginEvent(data, method){
    var res = new Promise((resolve, reject)=>{
        let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY) 
        window.apiSocket.emit(method, encryptStr, (res)=>{
            console.log(res)
            if (res.error_code === store.getters.CODE.SUCCESS.value) {
                resolve(res)
            }
            if (res.error_code === store.getters.CODE.BAD_REQUEST.value || res.error_code === store.getters.CODE.ERROR.value) {
                if(res.show == true){
                    // Toast({mes:res.msg,icon: 'error'})
                    Message({
                        message: res.msg || "Error",
                        type: "error",
                        duration: 5 * 1000,
                    });
                }
                // Loading.close()
                reject('error')
            }
            if (res.error_code === store.getters.CODE.ERROR_AUTH_CHECK_TOKEN_FAIL.value) {
                clearTimeout(window.sendTimeOut)
                clearTimeout(window.broadcastTimeOut)
                clearInterval(window.loginConnectInterval)
                // Loading.close()
                // Toast({mes: res.msg,icon: 'error'})
                Message({
                    message: res.msg || "Error",
                    type: "error",
                    duration: 5 * 1000,
                });
                // 这里需要删除token，不然携带错误token无法去登陆
                window.localStorage.removeItem('token')
                store.commit('user/SET_TOKEN', null)
                router.push({name: 'authLogin'})
                reject('error')
            }
            reject('error')
        })
        
    })
    return res
}