/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
document.querySelector('.quit').addEventListener('click', () => {
    localStorage.clear()
    location.href = '../login/index.html'
})
const articleObj = {
    status: '',
    channel_id: '',
    page: '1',
    per_page:'2'
}
let totalCount = 0 

async function setArticleList() {
    const res = await axios({
        url: '/v1_0/mp/articles',
        params: articleObj
    })
    totalCount = res.data.total_count
    document.querySelector('.total-count.page-now').innerHTML = `共${totalCount}条`
    const info = res.data.results
    const articleStr = info.map(article => {
        return `<tr>
        <td>
          <img src="${article.cover.type === 0 ? `https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500`
                : article.cover.images[0]}" alt="">
        </td>
        <td>${article.title}</td>
        <td>
        ${article.status === 2 ? `  <span class="badge text-bg-success">审核通过</span>`
                : `<span class="badge text-bg-primary">待审核</span>`}
        </td>
        <td>
          <span>${article.pubdate}</span>
        </td>
        <td>
          <span>${article.read_count}</span>
        </td>
        <td>
          <span>${article.comment_count}</span>
        </td>
        <td>
          <span>${article.like_count}</span>
        </td>
        <td data-id=${article.id}>
          <i class="bi bi-pencil-square edit"></i>
          <i class="bi bi-trash3 del"></i>
        </td>
      </tr>`
    }).join('')
    document.querySelector('.art-list').innerHTML = articleStr
}
setArticleList()
/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
async function setChannelList() {
    const res = await axios({
        url:'/v1_0/channels'
    })
    console.log(res)
    const htmlStr = ' <option value="" selected="">请选择文章频道</option>' +
        res.data.channels.map(channel => {
        return  `<option value="${channel.name}">${channel.name}</option>`
    }).join('')
    document.querySelector('.form-select').innerHTML = htmlStr
}

setChannelList()
document.querySelectorAll('.form-check-input').forEach(radio => {
    radio.addEventListener('change', e => {
        articleObj.status = e.target.value
    })
})

document.querySelector('.form-select').addEventListener('change', e => {
    articleObj.channel_id = e.target.value
})

document.querySelector('.sel-btn').addEventListener('click', () => {
    setArticleList()
})
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
// 点击下一页
document.querySelector('.next').addEventListener('click', () => {
    pageNum = Math.ceil(totalCount / articleObj.per_page)
    console.log(pageNum)
    if (articleObj.page < pageNum) {
        articleObj.page++
        document.querySelector('.page-now').innerHTML = `第${articleObj.page}页`
        setArticleList()
    } else {
        alert('失败')
    }
})
// 点击上一页
document.querySelector('.last').addEventListener('click', () => {
    if (articleObj.page > 1)
        articleObj.page--
    document.querySelector('.page-now').innerHTML = `第${articleObj.page}页`
    setArticleList()
})
/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
// 因为删除按钮是动态生成的，需要找一个包含它的静态存在的class
document.querySelector('.art-list').addEventListener('click', async e => {
    if (e.target.classList.contains('del')) {
        const delId = e.target.parentNode.dataset.id
        const res = await axios({
            url: `/v1_0/mp/articles/${delId}`,
            method: 'DELETE',
        })
        // 删除最后一页的最后一条，需要自动翻页
        const children = document.querySelector('.art-list').children
        if (children.length === 1 && articleObj.page != 1) {
            articleObj.page--
        }
        document.querySelector('.page-now').innerHTML = `第${articleObj.page}页`
        setArticleList()
    }
})

// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
document.querySelector('.art-list').addEventListener('click', e => {
    if (e.target.classList.contains('edit')) {
        const artId = e.target.parentNode.dataset.id
        location.href = `../publish/index.html?id=${artId}`
    }
})

