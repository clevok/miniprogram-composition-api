## 尝试在小程序里使用 composition-api

### 缺点
1. 更新属性繁琐, 没有采用 Object.defineProperty(为了减少 属性添加删除上疑惑) 做监听, 也没有采用Proxy(版本问题)
    1.1 1导致 useCompute, useEffect 都需要开发者主动声明依赖
2. props 还没有做代理
3. 还在测试
4. 不太适用于大量静态内容, 建议提前定义好data, 因为数据是在 onLoad/attached触发赋值的


### setup

setup 函数是一个新的组件选项。作为在组件内使用 Composition API 的入口点。

- 调用时机
在onLoad/attached时候被执行

- 参数
该函数接收 props 作为其第一个参数, context 第二个参数
```js
definePage({
    data: {
        test: ''
    },
    setup(props, context) {
        console.log(props.name)
    }
})
```
`props`暂时还没有做特殊处理, `context`作为上下文对象, 暴露了一些api
```js
definePage({
    data: {
        test: ''
    },
    setup(props, context) {
        context.event.on('load', () => {});
        context.setData({
            age: useRef(16)[0]
        })
    }
})
```
1. `event`是事件通知模块, 包含常用的emit, on, once, off, context注册的事件, 在页面/组件被销毁时也会主动off
2. `setData`是封装后的setData, 支持对`ref包装对象`的解析, 其他用法和原生一致
3. `this`指向, 目前, setup, onLoad等其他的函数, this将会绑定到当前页面/组件实例

---

### 包裹对象useRef

**`useRef`**

`返回值1`
接受一个参数值并返回一个数组, 第一项 是被包装的对象。ref 对象拥有一个指向内部值的单一属性 .value。

```js
const [count, setCount] = useRef(0)
console.log(count.value) // 0

setCount(1)

console.log(count.value) // 1
```

`返回值1`
是更改该值的方法, 接受一个值或者一个方法
```js
const [count, setCount] = useRef(0)

// 回调函数返回的值作为要赋值
setCount((value) => value + 1);
setCount(value + 1);

```
更新值已经做了diff, 两次赋同一值将不会触发改变

采用了[westore](https://github.com/Tencent/westore) 的 json diff,用于对比文件并提取需要更改的路径, 用于最小化setData


1. 在视图层中读取
当该值被`setup`返回, 将进入data值, 可在模板中被读取到, 会自动解套,无需在模板中额外书写`.value`
```js
<template>
  <div>{{ count }}</div>
</template>

definePage({
    setup(props, context) {
        const [count, setCount] = useRef(0)
        return {
            count,
            updateCount() {
                setCount(count.value + 1)
            }
        }
    }
})
```

2. context.setData
`setup`返回值其实也是执行了`context.setData`

---

### 计算属性

**`useComputed`**
返回一个 不可手动修改的 ref 对象。可以理解为没有set方法返回的useRef

```js
const [count, setCount] = useRef(1)
const plusOne = computed(() => count.value + 1, [count])

console.log(plusOne.value) // 2

setCount(2)
```

`参数`
1. `callback` 监听变化的回调, 返回任意值
2. `any[]` 这个框架没有做依赖收集, 需要用户主动传入所有的依赖, 当里面的依赖变化时, 会触发回调函数执行,计算

计算属性总是最少会执行一次,为了第一次赋值

---

### 监听Ref值更新

**`useEffect`**
当被监听的ref对象变化时, 将触发, 返回值是个方法, 用于停止监听

`参数`
1. `callback` 监听变化的回调
2. `any[]` 这个框架没有做依赖收集, 需要用户主动传入所有的依赖, 当里面的依赖变化时, 会触发回调函数执行

```js
const [count, setCount] = useRef(1)
const stopHandle = useEffect(() => {
    console.log('我发送了变化');
    stopHandle()
}, [count])

setCount(2)
```

---

### 声明周期函数
可以直接导入 `onXXX` 一族的函数来注册生命周期钩子：
```js
import { onAttached, onHide, onShow } from 'vue'

const MyComponent = {
  setup() {
    onAttached(() => {
      console.log('mounted!')
    })
    onHide(() => {
      console.log('updated!')
    })
    onShow(() => {
      console.log('unmounted!')
    })
  },
}

```

---

### 依赖注入
`useProvide` 和 `useInject`, `useInjectAsync` 提供依赖注入, 功能和 `Session` 一致, 只是找了地方存了以下

---

### 不要这样做
1. 在未来某个时间 `useEffect`, `useComputed`, 在setup期间执行的监听操作都将绑定在该实例上, 在该实例销毁后, 也会同步取消监听事件, 如果你注册的监听,恰好某个组件执行了setup, 会出现, 他销毁后, 你注册的监听不起效果了, 一开始是不做这样的处理的, 只是为了避免大量的取消监听的写法, 于是做了这样的处理
我也很纠结, 这个问题一旦碰上了, 那就很致命了, 哎, 可是也没有特别好的办法 

---

### 为了什么
1. 替代 mixins, 代码复用新方案
2. 全局状态管理, 计算属性, watch 版本要求不高()
3. 解决页面状态一旦props很多地方,很深就很烦
4. data, methods 不再分散 


### 降级版
1. 没有采用 @vue/reactivity 因为 小程序经打点发现目前还有好多用户都不支持 Proxy,Reflect, 于是不采用了(已经有人写好了小程序版composition-api,可以直接用这个)[https://github.com/yangmingshan/vue-mini]
2. 理论上应该没有基础库兼容问题


### 思考1
1. setup触发 是一开始小程序加载就触发,用来初始化数据,还是 onLoad,attached 来触发, 如果是onLoad来触发,setup里面注册onLoad事件,感觉有点奇怪
2. provide 是否要实现单例? 如果真的要单例, 其实可以不放在生命周期触发, 加载即触发, 只provide一次也是一样的效果


### 差异
1. setup this执行是组件的实例
2. 自定义组件setup执行是在attached, 尽管create更早, 但是为了获取props, 所以就采用了attached了, props接下来需要ref化
3. useCompute, useEffect, 没有采用 Object.defineProperty 做依赖收集, 由开发者手动做依赖收集


### 注意
1. 暂不支持 ref 嵌套 ref的情况, 也是可以支持的, 而且容易有问题, 就是 更改最外层的ref的值, 是否会能直接更改里面ref的值, 所以不支持这样


### TODO
1. 需要一个能 根据 key 实现缓存组件的效果, 多个同一个key 的组件共享状态, 声明周期也不应该重复触发
参考之前的hooks的那个声明周期,可以实现类似的
2. 代理 props
5. router.go({ url: '', params:{} }), 自定义路由方法, params支持传入方法, 子页面可以被正常调用被传入的方法
5.1. router.back({ delta: 1, params: {}}) 后退的参数, 是否允许带到 onShow, 是否有必要
6. router支持别名, 用于解决以前是 /pages/logistics, 现在是 /sub-logistics/logsitcs 路径问题, 拦截这个别名, 跳转到我指定的路径
7. 对于tabbar页面实现页面传参, 额外添加声明周期 onTabPageShow 可以接受到 跳转到当前页, 相当于 onShow生命周期,用于解决tab页面第二次进入onLoad不触发, onShow也没有参数的问题, 还需要配置 让框架知道 哪些页面是tabbar页面, onTabPageShow需兼容直接进入的情况, 不通过自带的参数进来也需要能参数带来
8. 全局Components, Page混入还是有必要的, 比如 小程序双向绑定通过 bind:ing="$", 需要功能混入 $方法
9. inject感觉还可以更强大, 比如setup内的在组件或小程序注销后,也会被注销
10. setup 支持异步

```js
import { defineComponent } from '';

defineComponent({
    setup(props) {
        /**
         *  useRef返回是个数组, 数组第一个是 返回的可被监听的 对象, .value访问存储的值, 返回的第二个是个方法,用来触发改变的
         * 在视图层不需要 .value 来访问
        */
        const [ name, setName ] = useRef('along');
        setName('along1');

        // 计算属性返回的也是个可被观察的对象, .value是值
        const sayName = useCompute(() => {
            return '我名字叫' + name.value
        }, [ name ]);

        // watch,需手动传入要监听的
        const stopHandle = useEffect(() => {
            console.log('监听name');            
        }, [ name ]);

        // 停止监听
        // stopHandle();

        return {
            name, setName
        }
    }
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


### 场景问题解决
1. 为了解决mixins问题
示例 searchList

```js
function useSearchList () {
    const [ pageStatus, setPageStatus] = useRef({
        page: 1,
        pageSize: 10,
        loadStatus: {
            isLoading: false,
            isEnd: false,
            isEmpt: false,
            isError: false
        }
    });

    const searchList = async function (api, params, options) {
        setPageStatus(status => {
            status.loadStatus.isLoading = true;
            return status
        });

        try {
            await api(Object.assign({ page: pageStatus.value.page, pageSize: pageStatus.value.pageSize }, params));
            setPageStatus(status => {
                status.page += 1;
                return status
            });
        } catch (e) {
            setPageStatus(status => {
                status.loadStatus.isError = true;
                return status
            });
        } finally {
            setPageStatus(status => {
                status.loadStatus.isLoading = false;
                return status
            });
        }
    }

    return { pageStatus, searchList }
}

createComponent({
    props: {
        name: string
    },

    /** 
     * 构建页面方法, 注意, 这个是小程序加载就执行的, 不要做什么错误的示例, 只能做初始化的
     */
    setup () {
        const { pageStatus, searchList, run, reset, refresh } = useSearchList();

        run(async () => {
            const { data } = await searchList(api.pack.getList, {}, {});
        })

        onLoad((props) => {
            reset();
        })

        onShow(() => {
            refresh();
        })

        return {
            pageStatus,
            renderList
        }
    }
})

```


### 子组件需要等待某个数据完成
场景, 页面有两个组件, 依赖父亲的值做渲染, 可是, 依赖某些数据, 是异步来的, 需要一个合适的方法, 让子组件知道什么父亲什么时候完成了？
1. 事件通知, 同时支持 回调 和 promise, 事件通知, 多了会很讨厌的
2. 就是有了数据再渲染组件,可不适用于所有的场景

```js
<template>
    <child1 title="title"></child1>
    <child2 packStatus="packStatus"></child2>
</template>
Page({
    data: {
        title: '准备中',
        packStatus: {
            id: 0,
            name: '准备中'
        }
    },
    setup() {
        onLoad (async() => {
            const id = await Api();
            useEmit('packageStatus', {
                id
            })
        })
    }
});

```

下面这个方式不行, 影响到了声明周期的调用,很容易留坑
```js
Componet(async () => {
    const packageStatus = await useInjectAsync('packageStatus');

    /** 应该还支持动态再新增属性 */
    useSetData()

    return {
        packageStatus
    }
})
```