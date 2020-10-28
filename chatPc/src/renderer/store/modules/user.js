import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from "@/utils/localstorage";
import {ipcRenderer} from 'electron'
import { login } from '@/socketioApi/user'
import md5 from 'js-md5'
import { deleteTables } from "@/utils/indexedDB";
import { setDown, send } from "@/utils/socketio";
import { clearData } from "@/utils/auth";
const state = {
  token: getToken('token'),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  homePageMsg:{},
  userInfo:storage.get('user')
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  updateUserInfo(state, userInfo){
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login({email:userInfo.email, password:md5(userInfo.password)}).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken('token',data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      /* getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        } */
        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', 'test')
        commit('SET_AVATAR', '')
        commit('SET_INTRODUCTION', '')
        resolve(['admin'])
     /*  }).catch(error => {
        reject(error)
      }) */
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      ipcRenderer.send('mianWindowLogout', 'ping') //给主进程发送消息“ping”
      removeToken()
      resetRouter()
      //更新在线状态
      clearInterval(window.loginConnectInterval);
      clearTimeout(window.sendTimeOut)
      clearTimeout(window.broadcastTimeOut)
      clearTimeout(window.timeOut);
      send("logoutDisconnect", {}, "logoutDisconnect");
      //监听
      clearData();
      setDown();
      deleteTables();
      resolve()
      /* logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        ipcRenderer.send('mianWindowLogout', 'ping') //给主进程发送消息“ping”
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      }) */
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
