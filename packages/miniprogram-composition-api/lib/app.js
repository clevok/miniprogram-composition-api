"use strict";
// defineApp({
//     // 跳转规则, 找到对应别名alias/page, 匹配到别名采用别名,没有则匹配page, 最后 则尝试直接跳转页面
//     router: {
//         tabbar: [
//             {
//                 // 路径
//                 url: '/page/index/index',
//                 // 别名
//                 alias: 'index'
//             }
//         ],
//         pages: [
//             {
//                 // 路径
//                 url: '/page/index/index',
//                 // 别名
//                 alias: 'index'
//             },
//             {
//                 url: '/page/message/message',
//                 // 重定向 {query, params}, query 是路由跳转载荷, params 是路径上的参数对象
//                 // to,要前往的页面, from来自哪个页面
//                 beforeEnter: (to, from, next) => {
Object.defineProperty(exports, "__esModule", { value: true });
//                     // 调用 next,则跳转到该 url 上,挈带 params,query
//                     next({
//                         url: '',
//                         alias: '',
//                         params: {},
//                         query: {}
//                     })
//                 }
//             }
//         ]
//     }
// })
function defineApp(params) {
    App(params);
}
exports.defineApp = defineApp;
