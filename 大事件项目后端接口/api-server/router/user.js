// user.js包含用户的路由模块

const express = require('express')
// 创建路由对象
const router = express.Router()
const userHandler = require('../router_handler/user.js')
// 安装 @escook/express-joi 中间件，来实现自动对表单数据进行验证的功能
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user.js')

// 注册新用户
router.post('/reguser',expressJoi(reg_login_schema),userHandler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema),userHandler.login)

// 将路由对象暴露出去
module.exports = router