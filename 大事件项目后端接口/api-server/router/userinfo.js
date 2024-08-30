/**
 *  1.初始化路由模块
 *  2.初始化路由处理函数模块
 *  3.获取用户的基本信息
 */

const express = require('express')
const router = express.Router()
const userinfo_handler = require('../router_handler/userinfo')
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const { update_userinfo_schema,update_password_schema, update_avatar_schema } = require('../schema/user.js')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置密码的路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)

// 更新用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)

// 向外共享路由对象
module.exports = router