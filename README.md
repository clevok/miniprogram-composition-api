## 尝试在小程序里使用 composition-api

- [案例](./EXAMPLE.md)
- [版本更新](./TODO.md)

### 下载

> npm install miniprogram-composition-api --save
> [仓库地址](https://github.com/clevok/miniprogram-composition-api)

### 使用前请考虑

这个框架并不是vue composition api写法, 因为得考虑到 `IOS10` 以下的客户无法使用Proxy, 处于这个原因, 3个核心api都不一致

1. 它是过度产品, 是因为我想使用`function api`的方式写小程序, 但是可能会面临`兼容性问题`可能会被上司要求解决,除非可以让用户升级系统版本(曾经考虑过`Object.defineProperty`和脏检查)

2. 最终ref对象采用的是[mobx box方案](https://cn.mobx.js.org/refguide/boxed.html)方案, 意味着要通过`.set`读取值, `.get/.value`获取值, 有些人可能会很不喜欢, 因为`.set`方式 和 直接修改`.value`值的方式, 直觉上的相差太多, 并且常常会忘记需要 `.value` 来获取真正的值

3. 已经有真正使用`@vue/reactivity` 的[小程序框架 了](https://github.com/yangmingshan/vue-mini) 直接采用了[@vue/reactivity](https://github.com/vuejs/vue-next/tree/master/packages/reactivity) 做响应式数据, 不考虑proxy问题,可以考虑这个框架

**请慎重考虑, 毕竟非主流, 非标准**


---

### 必读

1. 比较别扭的是, 更新 useRef 对象的值必须通过 `.set`方法, `读取`必须是 `.value`或者`.get()`

2. 响应式数据, 会通过 `westore.diff` 转换到 视图层, 某些情况下, 视图层数据 会与逻辑层中不一致
      1. 删除数组中的某一项, 其实会把 这个项目变成 null, 例如 [1,2,3] => [1,null,3]
      2. 删除对象某个属性, 会把这个属性设置成 null 例如 { name: 'along' } => {name: null}
      3. 之后会尝试优化 westore 的 diff, 如果设置成了空 数组 或者空对象, 就直接变成 全部复制, 以及提供 diff: false, 不经过他的 diff, 直接整个赋值
      4. 将会建立自己一套 diff 树,目前更新颗粒度只有一层..


### 解决什么

1. 带来新的代码复用方案(比 mixins 更友好)
2. 带来另一个种全局状态管理思路
3. `计算属性computed`,`监听watch`也都有, 没有基础库限制要求(定义的时候需要用户主动传入依赖项)
4. 新的写法,不再是 {data:{},methods,生命周期方法}这类写法

## 使用入门

### 基础概念

最基础的思想: 通过 将`响应式对象` _注入_ 到 `视图层` 中, (`响应式对象`的值更改, 将同步更新视图层)
(缺陷: 因为版本兼容性问题, 还是通过显式的 `.set` 方式更新 `响应式对象值`)

而不在是 页面定义 data, 通过 setData 更新页面值

将 `同一个响应式对象`注入到`多个页面`的中, 就实现了 多个页面的的数据保持一致(`状态管理`), (将这个响应式对象放在 app 中,每个页面拿过来注入到视图层中,就实现了`全局状态`)

### setup 入口

setup 函数是一个新声明周期, 在 onLoad 期间调用, 它会起到将`返回值`*注入*到`视图层`中的作用

`函数`也同样也可以`return`回去，便成了页面点击回调事件

> 也就是只有需要在视图层上需要渲染的变量/方法,才需 return 回去, 否者将不会会渲染到视图中

```html
<template bind:tap="onClick"> {{name}} </template>
<script>
      import { definePage } from "miniprogram-composition-api"
      definePage({
            setup() {
                  const name = useRef("along")
                  const onClick = () => {
                        console.log("试图层点击事件")
                        name.set("name")
                  }
                  return {
                        name,
                        onClick,
                  }
            },
      })
</script>
```

### useRef 对象

这是一套响应式数据
通过`setup`可以将`响应式对象`*`注入`*到`视图层`中,只要这个`响应式对象`值变化了,那么注入到的视图层里的值都会变,(也就是说定义一个叫 cart 的 ref 对象,A 页面注入了 cart,B 页面也注入了 cart, 只要 cart 值变了, A 页面和 B 页面的对应的值都会变化)

```js
// global.js
export const cart = useRef({ name: "小兰" })
```

```html
// A页面和B页面都这样写
<template> {{cart.name}} </template>
<script>
      import { definePage } from "miniprogram-composition-api"
      import { cart } from "./global"

      definePage({
            setup() {
                  return {
                        cart,
                  }
            },
      })
</script>
```

A 页面和 B 页面注入了 同一个响应式对象, 只要 `cart`发送了变化, 所有页面上的 name 值都会变化！这就是响应式对象

### 包裹对象 useRef

**创建 ref 对象**
useRef 对象接受一个参数作为初始值, 通过 .value 获取值

```js
const count = useRef(0)
console.log(count.value) // 0
```

**如何更新 ref 对象的值**
必须通过`.set`更新 ref 的值,才能正常使用

```js
const count = useRef(0)
console.log(count.value) // 0

count.set(1)

console.log(count.value) // 1
```

.set 有两种用法

1. 接受一个一个非方法对象,将会直接改变这个 ref 的值
2. 接受一个方法, 将会调用这个方法并传入原来的值, 接受这个方法返回的值作为更改后的值

```js
const count = useRef(0)

count.set((value) => value + 1)
count.set(value + 1)
```

为了避免按引用类型对象不小心被刚刚坑,我们断绝了除 .set 方法外一切 可能更改 ref 内部值的途径

```js
var a = { name: 123 }
var b = useRef(a)
var c = b.value
var d = b.get()

// 他们的关系分别是
// a ,  b  , [ c, d ], 只有 c和d 是指针指向相同的
// a !== b !== (c === d)
```

1. 在视图层中读取

更新值已经做了 diff, 两次赋同一值将不会触发改变

采用了[westore](https://github.com/Tencent/westore) 的 json diff,用于对比文件并提取需要更改的路径, 用于最小化 setData

当该值被`setup`返回, 将进入 data 值, 可在模板中被读取到, 会自动解套,无需在模板中额外书写`.value`

```html
<template>
      <div>{{ count }}</div>
</template>
<script>
      definePage({
            setup(props, context) {
                  const count = useRef(0)
                  return {
                        count,
                        updateCount() {
                              count.set(count.value + 1)
                        },
                  }
            },
      })
</script>
```

### 计算属性

**`useComputed`**
返回一个 不可手动修改的 ref 对象。可以理解为没有 set 方法返回的 useRef

```js
const count = useRef(1)
const plusOne = useComputed(() => count.value + 1, [count])

console.log(plusOne.value) // 2
```

`参数`

1. `callback` 监听变化的回调, 返回任意值
2. `any[]` 这个框架没有做依赖收集, 需要用户主动传入所有的依赖, 当里面的依赖变化时, 会触发回调函数执行,计算

计算属性总是最少会执行一次,为了第一次赋值

---

### 监听 Ref 值更新

**`useEffect`**
当被监听的 ref 对象变化时, 将触发, 返回值是个方法, 用于停止监听

`参数`

1. `callback` 监听变化的回调
2. `any[]` 这个框架没有做依赖收集, 需要用户主动传入所有的依赖, 当里面的依赖变化时, 会触发回调函数执行

```js
const count = useRef(1)
const stopHandle = useEffect(() => {
      console.log("我发送了变化")
      stopHandle()
}, [count])

count.set(2)
```

---

### 声明周期函数

可以直接导入 `onXXX` 一族的函数来注册生命周期钩子：
特殊, Component 和 Page 都是 onLoad, onUnLoad, onReady

```js
import { onLoad, onUnLoad onHide, onReady, onShow } from 'vue'

const MyComponent = {
  setup() {
    onLoad(() => {
      console.log('onLoad!')
    })
    onUnLoad(() => {
      console.log('onUnLoad!')
    })
    onReady(() => {
      console.log('onReady!')
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

## 高级功能

### 依赖注入

依赖注入参考了 angular, 这一点和 vue 的 inject,provied 有所区别一样
依赖注入除了逻辑复用外,还实现了组件树上共享数据,不再需要疯狂传递 props，疯狂 targetEvent 事件

这里直接上代码体现它的用处

#### 需求

有个店铺消息模块,可以更新店铺名字,
有一个页面,上面需要展示店铺名字，他还有很多页面级别组件，需要修改姓名，也需要显示店铺姓名，传统主页面通过 props 传下去也可以，修改姓名的话，再通过事件传上来,调用页面上修改店铺姓名的方法。如果层级多就很麻烦，而且还没有 ts 提示

#### 改用依赖注入

可以先创建公共的模块

```js
function useShopInfo() {
    const shopInfo = useRef({ name: '店铺名字' });
    const updateShopName = (name: string) => {
        shopInfo.set(value => { ...value, name })
    }

    return {
        shopInfo,
        updateShopName
    }
}

```

页面

```js
import { useShopInfo } from "shopServices"
definePage({
      provide: { useShopInfo },
      setup(props, { provide }) {
            const { useShopInfo } = provide
            return {
                  shopInfo: useShopInfo.shopInfo,
            }
      },
})
```

组件

```js

import { useShopInfo } from 'shopServices';
defineComponent({
    inject: {useShopInfo},
    setup(props, { inject } ) {
        const { useShopInfo } = inject

        return {
            shopInfo: useShopInfo.shopInfo
            onChangeName() {
                useShopInfo.updateShopName('along')
            }
        }
    }
})
```

以上代码页面和组件将共用一个数据
因为 inject 将会往其父级寻找已经`实例`的该函数,如果组件数上没有找到，那么将会往 app 上寻找，如果还没有,那么自身将会`主动实例化`,最后一点和 vue 不一样,因为 vue 你还得考虑父级没有的情况.

注意了，找上级需要建立组件树, 因为小程序目前的 api 问题，需要开发者主动通过 在组件上写 `bind:component="$"` 建立上下关系, 因为目前小程序 api 问题

除了 `inject`, `provide` 方式,也可以使用 `useInject`, `useProvide` 来手动注入一些需要参数的`函数api`, 注意咯, 不同的函数会实现不同的注入

```js
<template>
    <customer-component bind:component="$"></customer-component>
<template>
```

#### 我设想的结构

hooks

```js
// 用户信息
function useUserInfo() {
      return {
            userInfo: useRef(),
      }
}
function useShopInfo() {
      return {
            shopInfo: useRef(),
      }
}
```

app

```js
defineApp({
      provide: { useUserInfo, useShopInfo },
})
```

pageA

```js
defineComponent({
      inject: { useUserInfo, useShopInfo },
      setup(props, { inject }) {
            const { useUserInfo, useShopInfo } = inject

            const onUpdate = () => {
                  useUserInfo.update()
            }

            return {
                  userInfo: useUserInfo.userInfo,
                  onUpdate,
            }
      },
})
```

### 不要这样做

1. setup 不能是异步

2. `useEffect`, `useComputed`尽量在 setup 内做, 如果不是的话,注意做好清除清除监听

3. 在未来某个时间 `useEffect`, `useComputed`, 在 setup 期间执行的监听操作都将绑定在该实例上, 在该实例销毁后, 也会同步取消监听事件, 如果你注册的监听,恰好某个组件执行了 setup, 会出现, 他销毁后, 你注册的监听不起效果了, 一开始是不做这样的处理的, 只是为了避免大量的取消监听的写法, 于是做了这样的处理
   我也很纠结, 这个问题一旦碰上了, 那就很致命了, 哎, 可是也没有特别好的办法

---

### 注意

1. 暂不支持 ref 嵌套 ref 的情况, 也是可以支持的, 而且容易有问题, 就是 更改最外层的 ref 的值, 是否会能直接更改里面 ref 的值, 所以不支持这样
