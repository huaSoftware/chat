/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 应用临时数据管理
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:28:51
 */
/**
 * 作者：yujinjin9@126.com
 * 时间：2017-01-19
 * app临时数据管理
 */
export default {
  state: {
    navbarTitle: '首页', // app的导航页标题
    imgUrl: process.env.PATH_INDEX_PIC,//图片前缀路径
    headerContentType:'application/json;charset=UTF-8',//规定类型
    htmlFontSize: 0
  },
  getters:{
    //判断吧标题是否和导航的一样 一样就有背景样式
    navbarTitle(state){
      return state.navbarTitle
    },
    htmlFontSize(state){
      return state.htmlFontSize
    }
  },

  actions: {
    //提交穿过来的参数 以及突变给mutations
    updateNavbarTitle({commit}, navbarTitle) {
      commit("updateNavbarTitle",navbarTitle);
    }
  },

  mutations: {
    //修改仓库值
    updateNavbarTitle(state, navbarTitle){
      state.navbarTitle = navbarTitle
    },
    updateHtmlFontSize(state, htmlFontSize){
      state.htmlFontSize =  htmlFontSize
    }

  }
}
