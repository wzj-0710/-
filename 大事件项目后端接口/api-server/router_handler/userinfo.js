const db =require('../db/index.js')
const bcrypt = require('bcryptjs')
// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 根据用户id，查询用户的基本信息
    // 为了防止用户密码泄露，需要排除password字段
    const sql = `select id,username,nickname,user_pic from ev_users where id = ?`
    // req对象上的user属性，是Token解析成功的数据结果
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length!=1) return res.cc('用户获取信息失败')
        res.send({
            status: 0,
            message: '用户获取信息成功',
            data: results[0],
        })
    })
}

// 更新用户的基本信息
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id = ?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败')
        return res.cc('修改用户信息成功',0)
    })
}

// 重置密码处理函数
exports.updatePassword = (req,res) => {
    const sql = `select * from ev_users where id = ? `
    // 执行sql语句查询用户是否存在
    // req.user  可以在后续的请求处理过程中获取到当前已经验证的用户的相关信息
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult)
            return res.cc('原密码错误！')
        // 原密码正确
        const sql = `update ev_users set password = ? where id = ?`
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1)
                return res.cc('更新密码失败')
            res.cc('更新密码成功',0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic = ? where id = ?`
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更换头像失败')
        // 用户头像更新成功
        return res.cc('更换头像成功', 0)
    })
}

