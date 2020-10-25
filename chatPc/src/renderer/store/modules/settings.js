/*
 * @Author: hua
 * @Date: 2020-04-18 20:19:12
 * @description:
 * @LastEditors: hua
 * @LastEditTime: 2020-04-18 20:20:47
 */
import defaultSettings from "@/settings";

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;

const state = {
  theme: "theme",
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
