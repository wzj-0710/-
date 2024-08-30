/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */
// 添加按钮监听事件
document.querySelector('.btn').addEventListener('click', () => {
    const form = document.querySelector('.login-form')
    const data = serialize(form)
    console.log(data)
    axios({
        url: '/v1_0/authorizations',
        method: 'POST',
        data
    }).then(result => {
        console.log(result)
        myAlert(true, '登录成功')
        //登入成功后，保存token令牌字符串到本地，并跳转到内容表页面
        localStorage.setItem('token', result.data.token) 
        setTimeout(() => {
            location.href = '../content/index.html' 
        },1500)
    }).catch(error => {
        console.log(error)
        myAlert(false,error.response.data.message)
    })
})