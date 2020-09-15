

### TODO
1. 部分api静止set
5. router.go({ url: '', params:{} }), 自定义路由方法, params支持传入方法, 子页面可以被正常调用被传入的方法
5.1. router.back({ delta: 1, params: {}}) 后退的参数, 是否允许带到 onShow, 是否有必要
6. router支持别名, 用于解决以前是 /pages/logistics, 现在是 /sub-logistics/logsitcs 路径问题, 拦截这个别名, 跳转到我指定的路径
7. 对于tabbar页面实现页面传参, 额外添加声明周期 onTabPageShow 可以接受到 跳转到当前页, 相当于 onShow生命周期,用于解决tab页面第二次进入onLoad不触发, onShow也没有参数的问题, 还需要配置 让框架知道 哪些页面是tabbar页面, onTabPageShow需兼容直接进入的情况, 不通过自带的参数进来也需要能参数带来
8. 全局Components, Page混入还是有必要的, 比如 小程序双向绑定通过 bind:ing="$", 需要功能混入 $方法
9. inject感觉还可以更强大, 比如setup内的在组件或小程序注销后,也会被注销
11. context event 允许监听 声明周期方法
12. 自定义组件和page组件生命周期统一√
13. useContext,createContext实现方案, 组件必须通过 bind:context="$" / ref="$" | onContext="$", 建立上下文关系(__parents,__childs), 会不会麻烦?, app应该是所有人的父亲页面
14. 自定义get,set ref, 实现set转意, get也能格式化
15. 事件传递很麻烦,例如input基础上又来了个inputCacle, inputCacle需要把input所有的事件再统一传递出去,很烦人, 该怎么解决没想好


### 获取父亲的声明周期
```js

onPageLife(() => {
    onReachBottom(() => {
        
    })

    onPullDownRefresh(() => {

    })
})

```

### 共享空间
这个目前打算创建一个单例工程模式useConstate,用于在setup期间创建单例

```js
function useName (params) {
    const name = useRef(1)
    onLoad(() => {
        name.set(2)
    })

    return name
}

// 因为考虑到很多业务的情况, 有些空间都带有一些异步请求后的参数才能被加载, 对于那些需要难搞的参数才能初始化的api,于是用异步的injectContext来实现加载
// 也就是说采用了 injectContext, 将意味着 无法通过setup注入(setup不允许异步这是铁板钉钉上的事情)
// 要不展示不考虑?

```
```js
// A页面
defineComponent(() => {
    const a = useConstate(useName)()

    onReachBottom(() => {
        a.renderList()
    })
})

// B页面
defineComponent(() => {
    const b = useConstate(useName)

    return {
        ...b
    }
})
```
这样,对a进行更改,b也会同步修改了,原本是想,后来发现，这样和依赖注入没啥区别,不能很好的找到, 都有谁共享了我
```js
setup(() => {
    const a = useConstate(useName);
})
```

### 依赖注入

```js
function useName() {
    return {
        renderList
    }
}

// pageA
setup(() => {
    const { renderList } = useProvied(useName)
})
// pageA component
setup(() => {
    const { renderList } = useInject(useName) // 提取最近的依赖注入
})

// pageB
setup(() => {
    const { renderList } = useProvied(useName)
})

```


### 下一版本将支持router带方法传递

方法可以类似于props被带过来, 主要为了减少事件发布订阅

```js

import { router } from '';

router.go({
    url: '/pages/createSuccess?isplit=123',
    params: {
        onSubmit() {
            
        }
    }
})

// /pages/createSuccess
definePage((props) => {
    props.onSubmit && props.onSubmit();
});

```

