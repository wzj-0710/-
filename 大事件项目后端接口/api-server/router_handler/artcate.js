const { result } = require('@hapi/joi/lib/base.js')
const db = require('../db/index.js')

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    // 根据分类状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有标记为删除的数据
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, results) => {
        // 执行sql语句错误
        if(err) return res.cc(err)
        // 执行sql语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results,
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的SQL语句
    const sql = `select * from ev_article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 判断分类名称和分类别名是否被占用
        if (results.length == 2) return res.cc('分类名称与别名都被占用，请更换后重试')
        // 分别判断 分类名称 和 分类别名 是否被占用
        if (results.length == 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')   
        // 若没有相同的 文章名称 和 文章别名 ，新增文章分类
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) => {
            // 执行SQL语句失败
            if (err) return res.cc(err)
            // SQL语句执行成功，但影响函数不等于1
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            // 新增文章分类成功
            res.cc('新增文章成功', 0)
        })
        
    })
}

// 删除文章分类的处理函数(标记删除法)
exports.deleteCateById = (req, res) => {
    // 定义删除文章分类的SQL语句
    const sql = `update ev_article_cate set is_delete =1 where id =?`
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL语句失败
        if (err) return res.cc(err)
        // SQL 语句执行成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        // 删除文章分类成功
        res.cc('删除文章分类成功', 0)
    })
}

// 根据Id获取文章分类的处理函数
exports.getArticleById = (req, res) => {
    const sql = 'select * from ev_article_cate where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章数据失败')
        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章内容数据成功',
            data: results[0]
        })
    })
}

// 根据id更新文章分类数据
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的SQL语句
    const sql = 'select * from ev_article_cate where id<>? and (name =? or alias = ?)'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        // 判断分类名称 和 分类别名 是否被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        // 没有重复的，更新文章内容
        const sql = 'update ev_article_cate set ? where id = ?'
        db.query(sql, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            // SQL语句执行成功，但是影响行数不等于1
            if (results.affectedRows !== 1) return res.cc(err)
            res.cc('更新文章分类成功', 0)
        })
    })
}