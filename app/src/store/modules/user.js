import { getToken } from '@/utils/auth'


export default {
    state: {
        token: getToken('token'),
        homePageMsg:{}
    },
    getters:{
      homePageMsg(state){
          return state.homePageMsg
      }
    },
    actions: {
    
    },
    mutations: {// 只支持同步
      // 这边设置下token，参看login.vue
      SET_TOKEN: (state, token) => {
        state.token = token
      }
    }
}