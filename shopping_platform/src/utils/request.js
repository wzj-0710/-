import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: {
    // 添加 platform 到请求头
    platform: 'h5'
  }
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 开启loading，禁止背景点击（节流处理，防止多次无效触发）
  Toast.loading({
    message: '加载中...',
    forbidClick: true, // 禁止背景点击
    loadingType: 'spinner', // 配置loading图标
    duration: 0 // 不会自动消失
  })

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 任何状态码在 2xx 范围内的响应会触发这个函数
  // 处理响应数据
  const res = response.data
  if (res.status !== 200) {
    // 给错误提示，Toast默认是单例模式，后面的Toast调用会使得前面一个Toast效果覆盖
    // 同时只能存在一个Toast
    Toast(res.message)
    console.log(res)
    return Promise.reject(res.message)
  } else {
    Toast.clear()
  }
  return res
}, function (error) {
  // 任何状态码在 2xx 范围外的响应会触发这个函数
  // 处理响应错误
  return Promise.reject(error)
})

export default instance
