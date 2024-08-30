/**
 * 为了保证路由模块的纯粹性，所有的路由处理函数，必须抽离到对应的路由处理函数模块中，在这里定义和用户相关的路由处理函数，供/router/user.js模块进行调用
 */
const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config.js')
/**
 * 注册实现步骤：
 * 1. 检测表单数据是否合法
   2. 检测用户名是否被占用
   3. 对密码进行加密处理
   4. 插入新用户
 */

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收用户提交数据
    const userinfo = req.body
    // 检测表单数据是否合法
    // if (!userinfo.username || !userinfo.password)
    //     return res.send({ status: 1, message: '用户名或者密码不能为空！' })
    //检测用户名是否被占用
    const sql = 'select * from ev_users where username = ?'
    db.query(sql, [userinfo.username], function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！')
        }
  
    // 对密码进行加密处理(加盐处理)
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    
    // 插入新用户
    const sql1 = 'insert into ev_users set ?';
    db.query(sql1, { username: userinfo.username, password: userinfo.password }, function(err, results) {
        // 执行 SQL 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message });
            return res.cc(err)
        }
    
        // SQL 语句执行成功，但影响行数不为 1
        if (results.affectedRows !== 1) {
            // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' });
            return res.cc('注册用户失败，请稍后再试！')
        }
    
        // 注册成功
        // res.send({ status: 0, message: '注册成功！' });
        res.cc('注册成功！',0)
    });
})
}

/**
 * 登录实现步骤：
 * 1. 检测表单数据是否合法
   2. 根据用户名查询用户的数据
   3. 判断用户输入的密码是否正确
   4. 生成 JWT 的 Token 字符串
 */


// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    const sql = 'select * from ev_users where username = ?'
    //执行sql语句，查询用户数据
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        // 执行成功，但根据username查询到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败')
        // 将用户输入密码与数据库中密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    
        if (!compareResult)
            return res.cc('密码错误，登录失败')

        // 登录成功，需要生成token字符串，但需要去除密码和头像的值
        const user = { ...results[0], password: '', user_pic: '' }
        // 生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h', })//token有效期为10小时
        res.send({
            status: 0,
            message: '登录成功',
            // 为了方便客户端使用Token，在服务器端直接拼接上Bearer的前缀
            token: 'Bearer' + tokenStr
        })
    })
}