// 约定一个通用的键名
const INFO_KEY = 'shopping_info'

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
