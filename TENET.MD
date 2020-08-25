### 原则

1. 避免setup面条式代码
尽量分化成多个组合函数,以`use`开头
```js
setup() {
    const appInfo = useAppInfo()

    return { appInfo }
}

```

2. 为了避免追踪响应式数据变化困难,一个变量值应该只能在其所在组合函数被修改

```js
setup(() => {
    const appInfo = useAppInfo()
    // 不应该这样
    useUpdate(appInfo)

    return {
        appInfo
    }
})
function useAppInfo () {
    const info = ref({})
    return info
}
// 不应该修改其他函数体的响应式数据
function useUpdate(info) {
    info.set(false)
}

```

3. 当遇到需要公用的模块,可以提取到 [page.name].services.ts中
小程序中import 页面/组件的 会出现不可预料的问题