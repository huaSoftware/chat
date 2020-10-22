/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: app路由状态管理
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:06:56
 */

export default {
  state: {
    direction: null, //going：前进|backing后退|replace
    transition: "next", //fang
    backConfig: {} //返回指定的路由配置选项{name|appfrom|query|url|callback}
  },
  actions: {
    updateDirection({
      commit
    }, direction) {
      commit("updateDirection", direction);
    },
    updateTransition({
      commit
    }, transition) {
      commit("updateTransition", transition);
    },
    updateBackConfig({
      commit
    }, config) {
      commit("updateBackConfig", config);
    },
    resetBackConfig({
      commit
    }) {
      commit("resetBackConfig");
    }
  },
  mutations: {
    //修改路由的方向
    updateDirection(state, direction = "going") {
      state.direction = direction;
      if (direction) {
        state.transition = (direction === "backing" ? "prev" : "next");
      }
    },
    updateTransition(state, transition) {
      state.transition = transition;
    },
    //修改返回路由的配置选项
    updateBackConfig(state, config) {
      state.backConfig = config;
    },
    //重置回路由的配置选项内容
    resetBackConfig(state) {
      state.backConfig = {};
    }
  }
}
