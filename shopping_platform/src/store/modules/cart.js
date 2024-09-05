import { getCartList, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      cartList: []
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item =>
        item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsId, value }) {
      const obj = state.cartList.find(item => item.goods_id === goodsId)
      obj.goods_num = value
    }
  },
  // 异步操作
  actions: {
    async getCartAction (context) {
      const { data } = await getCartList()
      // 后台返回数据中，不包含复选框的选中状态
      // 需要手动维护数据，给每一项添加一个isChecked状态，标记状态是否选中
      data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, obj) {
      const { goodsId, value, skuId } = obj
      context.commit('changeCount', {
        goodsId,
        value
      })
      await changeCount(goodsId, value, skuId)
    },
    // 删除购物车数据
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新拉取最新的购物车数据
      context.dispatch('getCartAction')
    }
  },
  // 动态计算展示
  getters: {
    // 求所有商品累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) =>
        sum + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    // 全选(判断购物车中商品是否都被选中)
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
