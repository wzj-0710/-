/**
 * 1. 初始化路由模块
   2. 初始化路由处理函数模块
   3. 使用 multer 解析表单数据
   4. 验证表单数据
   5. 实现发布文章的功能
 */

const express = require('express')
const router = express.Router()
const article_handler = require('../router_handler/article')
// 导入解析formdata格式表单数据的包
const multer = require('multer')
const path = require('path')
// 创建multer的实例对象，通过dest属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema, delete_schema, update_article_schema } = require('../schema/article')


// 发布新文章
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

// 获取文章的列表数据
router.get('/list',expressJoi(delete_schema),article_handler.getArticle)

// 根据ID删除文章路由
router.get('/delete/:id', expressJoi(delete_schema), article_handler.deleteById)

// 更新文章的路由
router.post('/edit',upload.single('cover_img'),expressJoi(update_article_schema),article_handler.editArticle)

module.exports = router