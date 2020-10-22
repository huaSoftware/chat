/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 用户信息
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:07:35
 */

import { getToken } from '@/utils/auth'
import storage from "@/utils/localstorage";

export default {
    state: {
        token: getToken('token'),
        homePageMsg:{},
        userInfo:storage.get('user')
    },
    getters:{
      homePageMsg(state){
        return state.homePageMsg
      },
      userInfo(state){
        return state.userInfo
      }
    },
    actions: {
    
    },
    mutations: {// 只支持同步
      // 这边设置下token，参看login.vue
      SET_TOKEN: (state, token) => {
        state.token = token
      },
      updateUserInfo(state, userInfo){
        state.userInfo = userInfo
      }
    }
}