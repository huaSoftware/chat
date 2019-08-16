/* 权限函数工具库
 * author hua
 * 2018,3,29
 */
import store from '../store'

/* 获取token
 * params:tokenName;令牌名
 * return bool or token
 */
export function getToken (tokenName) {
  let data = window.localStorage.getItem(tokenName)
  if (data == null) {
    return false
  }
  let dataObj = JSON.parse(data)
  var dataObjDatatoJson = dataObj.data
  return dataObjDatatoJson
}

/* 设置token
 * params:tokenName;令牌名
 * params:tokenVal;令牌值
 * return bool
 */
export function setToken (tokenName, tokenVal) {
  let curTime = new Date().getTime()
  window.localStorage.setItem(tokenName, JSON.stringify({ data: tokenVal, time: curTime }))
  return true
}

/* 销毁token
 * params:tokenName;令牌名
 * return bool
 */
export function removeToken (tokenName) {
  window.localStorage.removeItem(tokenName)
  return true
}

/**
 * 注销账户时清理数据
 */
export function clearData(){
  //清除localstorage数据
  window.localStorage.clear();
  //清除indexdb数据
  window.indexedDB.deleteDatabase('addressBookBeg')
  window.indexedDB.deleteDatabase('msg')
  //失效token
  store.commit('SET_TOKEN', '')
}

