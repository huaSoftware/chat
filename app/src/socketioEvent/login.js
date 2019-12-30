/*
 * @Author: hua
 * @Date: 2019-12-30 20:41:57
 * @description: 
 * @LastEditors  : hua
 * @LastEditTime : 2019-12-30 21:01:19
 */
import store from '../store'
import router from '../router'
import {Loading, Toast} from 'vue-ydui/dist/lib.rem/dialog'
import {rsaEncode} from '@/utils/socketio'
export default function login(data, method){
    var res = new Promise((resolve, reject)=>{
        let encryptStr = rsaEncode(data, process.env.VUE_APP_PUBLIC_KEY)
        //设置超时时间5s
        window.timeOut = setTimeout(()=>{
            clearInterval(window.loginConnectInterval)
            router.push({
                name: 'connectLose',
                query: {text:"接口已断开链接，请重启"}
            })
        },5000)
        window.apiSocket.emit(method, encryptStr, (res)=>{
            clearTimeout(window.timeOut)
            console.log(res)
            if (res.error_code === 200) {
                resolve(res)
            }
            if (res.error_code === 400 || res.error_code === 500) {
                if(res.show == true){
                    Toast({mes:res.msg,icon: 'error'})
                }
                Loading.close()
                reject('error')
            }
            if (res.error_code === 401 || res.error_code === 10001) {
                clearTimeout(window.sendTimeOut)
                clearTimeout(window.broadcastTimeOut)
                clearInterval(window.loginConnectInterval)
                Loading.close()
                Toast({mes: res.msg,icon: 'error'})
                // 这里需要删除token，不然携带错误token无法去登陆
                window.localStorage.removeItem('token')
                store.commit('SET_TOKEN', null)
                router.push({name: 'authLogin'})
                reject('error')
            }
            reject('error')
        })
        
    })
    return res
}