defineApp({
    // 路由定义规则, 遍历数组,找到对应别名alias,跳转到该page,如果没有找到,则尝试直接跳转页面
    router: [
        {
            // 路径
            page: '/page/index/index',
            // 别名
            alias: 'index'
        },
        {
            page: '/page/message/message',
            // 重定向 {query, params}, query是路由跳转载荷, params是路径上的参数对象
            // to,要前往的页面, from来自哪个页面
            // next传入页面对象
            beforeEnter: (to, from, next) => {
                
            }
        }
    ]
})