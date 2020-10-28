//  localstorage 本地存储类
//  存储使用array

let storage = {
  /**
   * [保存数据到localstorage]
   * @param  {[type]} key [键值]
   * @param  {[type]} array [value值]
   * @return {[type]} bool  [布尔值]
   */
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  },

  /**
   * [从localstorage读取数据]
   * @param  {[type]} key [属性值]
   * @return {[type]}  bool or [属性值对应的value值]
   */
  get(key) {
    let data = window.localStorage.getItem(key)
    if (data == null) {
      return false
    }
    let dataObj = JSON.parse(data)
    return dataObj
  },

  // 删除单个数据 localstorage
  // @param  { [type] } key[属性值]
  // @return { [type]}  bool
  remove(key) {
    localStorage.removeItem(key)
    return true
  }
}

export default storage
