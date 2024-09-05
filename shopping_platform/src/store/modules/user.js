import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人信息
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
  actions: {
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})

      // 购物车信息要重置（跨模块调用mutation）
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
