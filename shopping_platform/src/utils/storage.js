// 约定一个通用的键名
const INFO_KEY = 'shopping_info'
// 约定搜索历史的键名
const HISTORY_KEY = 'history_list'
// 约定购物车键名
const CART_KEY = 'category_num'

// 获取个人信息
export const getInfo = () => {
  const defaultObj = { token: '', userId: '' }
  const result = localStorage.getItem(INFO_KEY)
  // JSON.parse():将一个 JSON 格式的字符串解析为 JavaScript 对象。
  return result ? JSON.parse(result) : defaultObj
}

// 设置个人信息
export const setInfo = (obj) => {
  // JSON.stringify():将一个 JavaScript 对象或数组转换为 JSON 格式的字符串。
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}
// 移除个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : []
}
// 设置搜索历史
export const setHistoryList = (obj) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(obj))
}

// 获取购物车商品数量
export const getCategoryNum = () => {
  const result = localStorage.getItem(CART_KEY)
  return result || 0
}

// 设置购物车商品数量
export const setCategoryNum = (cartTotal) => {
  localStorage.setItem(CART_KEY, cartTotal)
}

// 移除购物车商品数量
export const removeCategoryNum = () => {
  localStorage.removeItem(CART_KEY)
}
