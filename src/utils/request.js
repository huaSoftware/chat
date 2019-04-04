import axios from 'axios'
import store from '../store'
import router from '../router'
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_CLIENT_API, // client api的base_url
  timeout: 15000// 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 定义在store/user中，以后会添加权限等设置
  let token = store.getters.token
  // //console.log(store.getters.is_auth)
  if (store.getters.token) {
    config.headers['Authorization'] = 'JWT '+token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  config.headers['Content-Type'] = store.state.appData.headerContentType
  config.headers['Accept'] = 'application/json'
  return config
}, error => {
  // Do something with request error
  // //console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * error为true时 显示msg提示信息
  */
    // //console.log(response)
    const res = response.data
    // //console.log(response)

    /* if (res.error === true) {
      Toast(res.msg)
      return Promise.reject('error')
    } */
    // error为false时，code为200时显示数据
    // store.dispatch('updateIsAuth', true)
    // //console.log(store.getters.is_auth)
    if (res.error_code === 200) {
      return res
    }
    /* 微信未绑定跳转绑定页面 */
    if (res.error_code === 300) {
      Toast({mes:'未绑定,请先绑定手机号'})
      router.push('/newRegister')
      Loading.close()
      return Promise.reject('error')
    }
    if (res.error_code === 400) {
      if(typeof res.msg == 'object'){
        let msg = ''
        Object.keys(res.msg).forEach(function(key){
          res.msg[key].forEach(function(val, index) {
            msg = msg + val + ',';
          });

        });
        Toast({mes:msg.slice(0,msg.length-1)})
      }else{
        Toast({mes:res.msg})
      }
      Loading.close()
      // Toast('网络错误')
      return Promise.reject('error')
    }
    if (res.error_code === 401) {
      // Toast(res.msg)
      Loading.close()
      return Promise.reject('error')
    }
    if (res.error_code === 10001) {
      // Token expired
      Loading.close()
      Toast({mes: res.msg})
      // 这里需要删除token，不然携带错误token无法去登陆
      window.localStorage.removeItem('token')
      store.commit('SET_TOKEN', null)
      router.push({name: 'authLogin'})
    }
  },
  error => {
    Loading.close()
    // //console.log(error)// for debug
    /* 网络无响应处理 */
    // //console.log(error == 'Error: timeout of 15000ms exceeded')
    if (error == 'Error: timeout of 15000ms exceeded') {
      //console.log('网络超时')
    }
    if (typeof (error.response) === 'undefined') {
      if (error === 'Error: Network Error') {
        Toast({mes:'网络错误,请检查网络'})
      }
    }
    /* token未携带处理 */

    if (error.response.status === 401/*  && error.response.data.code === 401 */) {
      if (error.response.data.msg === 'The current Subject is not authenticated.  Access denied.') {
        router.push('/login')
        Toast({mes:'未登录，请先登录'})
      } else {
        Toast({mes:error.response.data.msg})
      }
      // 401暂定位token错误
      // setTimeout(router.push('/login'), 3000)
    }
    if (error.response.status === 400 /* && error.response.data.code === 500 */) {
      Toast({mes:error.response.data.msg})
    }
    /* if (error.response.status === 400) {
      Toast('网络错误')
    } */
    // 即使错误也得改回json
    // store.dispatch('updateHeaderContentTypeStatus', 'application/json;charset=UTF-8')
    // 即使错误也得改回不用认证

    // store.dispatch('updateIsAuth', false)
    return Promise.reject(error)
  }
)

export default service
