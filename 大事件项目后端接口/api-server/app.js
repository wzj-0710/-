// 导入express模块
const express = require('express')
// 创建express的服务器实例
const app = express()

// 导入配置文件
const config = require('./config')
// 解析token的中间件
const expressJWT = require('express-jwt')
const joi = require('joi')
// 导入中间件,解决跨域问题
const cors = require('cors')

// 将cors注册为全局中间件
app.use(cors())

// 导入解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 一定要在路由之前封装函数
app.use((req, res, next) => {
    res.cc = (err, status=1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//]
}))

// 导入并注册用户模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
//导入用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 不是 /api 开头的接口，都是有权限的接口，需要进行Token身份认证
app.use('/my', userinfoRouter)
// 导入并使用文章分类路由
const artCateRouter = require('./router/artcate')
app.use('/my/article',artCateRouter)

// 导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article',articleRouter)

// 捕获错误的中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError)
        return res.cc(err)
    // 捕获并处理 Token 认证失败后的错误：
    if (err.name === 'UnauthorizedError')
        return res.cc('身份认证失败')
    // 未知错误
    res.cc(err)
    
})


app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})