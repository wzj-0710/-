import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人信息
      //
      userInfo: getInfo()
    }
  },
  mutations: {
    // 所有mutations的第一个参数都是state
    setUserInfo (state, obj) {
      state.userInfo = obj
      // 将vuex中的用户数据存放到本地storage中
      setInfo(obj)
    }
  },
  actions: {},
  getters: {}
}
