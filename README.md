## 尝试在小程序里使用 composition-api

- [案例](./EXAMPLE.md)
- [版本更新](./TODO.md)

### 下载

> npm install miniprogram-composition-api --save

> [仓库地址](https://github.com/clevok/miniprogram-composition-api)

### 注意
1. ref对象的值必须通过ref.set方式更改值,类似小程序中必须通过setData更改视图值一样的,没有采用Proxy和Object.defineProperty
    原因 1: 已经有一个人采用 @vue/reactivity 做了[小程序版 composition api了](https://github.com/yangmingshan/vue-mini)
    原先 2: Object.defineProperty毕竟还存对对象操作上问题,于是想简单点,通过set传入修改后的对象来直接变值

2. 采用[westore](https://github.com/Tencent/westore) 的 json diff, 视图层上的数据,会出乎你意料之外,详情后面会将

### 解决什么
1. 带来新的代码复用方案(比mixins更友好)
2. 带来另一个种全局状态管理思路
3. `计算属性computed`,`监听watch`也都有, 没有基础库限制要求(定义的时候需要用户主动传入依赖项)
4. 新的写法,不再是 {data:{},methods,生命周期方法}这类写法

## 使用入门

### setup入口
以前都是在Componets.data定义属性,methods下定义方法这样写,现在呢
现在变成了 setup期间将 你想在视图层中显示的 数据或者方法 `return回去`, 或者叫 `注入到视图层`中
> 也就是只有需要在视图层上需要渲染的变量/方法,才需 return回去, 否者将不会会渲染到视图中

```js
<template>
    {{name}}
</template>
import { definePage } from 'miniprogram-composition-api'
definePage({
    setup() {

        return {
            name: '123'
        }
    }
})

```
name这个字段将会被注入到视图层里了,这么一看似乎也还好,只是以前配置到data,现在变成了js书写方法将你想要的东西`return|注入`到视图层
但是如果搭配`ref`响应式对象,那就能实现状态管理了

### useRef对象
这是一套响应式数据,`setup`可以将`响应式对象``注入`到`视图层`中,只要这个`响应式对象`值变化了,那么注入到的视图层里的值都会变,(也就是说定义一个叫cart的ref对象,A页面注入了cart,B页面也注入了cart, 只要cart值变了, A页面和B页面的对应的值都会变化)
```js
// global.js
export const cart = useRef({name: '小兰'})
export const updateCart = () => {
    cart.set({
        name: '小明'
    })
}
```
```html
// A页面和B页面都这样写
<template>
    {{cart.name}}
</template>
<script>
import { definePage } from 'miniprogram-composition-api'
import { cart } from './global'

definePage({
    setup() {

        return {
            cart
        }
    }
})
</script>
```
以上,只有某个地方调用 updateCart,所有页面上的name值都会变化！这就是响应式对象

## API文档

### setup

setup 函数是一个新声明周期,在onLoad期间调用, 将返回值注入到视图中

```js
definePage({
    setup() {
        return {
            name: '123',
            updateName () {

            }
        }
    }
})
```

### 包裹对象useRef

**`useRef`**
useRef对象接受一个参数作为初始值,必须通过 .value来访问 ref对象的值, .set来更新值

```js
const count = useRef(0)
console.log(count.value) // 0

count.set(1)

console.log(count.value) // 1
```

`修改值`
`.set`接受一个一个非方法对象,将会直接改变这个ref的值
接受一个方法, 将会调用这个方法并传入原来的值, 接受这个方法返回的值作为更改后的值
```js
const count = useRef(0)

count.set((value) => value + 1);
count.set(value + 1);

```

更新值已经做了diff, 两次赋同一值将不会触发改变

采用了[westore](https://github.com/Tencent/westore) 的 json diff,用于对比文件并提取需要更改的路径, 用于最小化setData


1. 在视图层中读取
当该值被`setup`返回, 将进入data值, 可在模板中被读取到, 会自动解套,无需在模板中额外书写`.value`
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
            }
        }
    }
})
</script>
```

### 计算属性

**`useComputed`**
返回一个 不可手动修改的 ref 对象。可以理解为没有set方法返回的useRef

```js
const count = useRef(1)
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
const count = useRef(1)
const stopHandle = useEffect(() => {
    console.log('我发送了变化');
    stopHandle()
}, [count])

count.set(2)
```

---

### 声明周期函数
可以直接导入 `onXXX` 一族的函数来注册生命周期钩子：
```js
import { onMounted, onUnmounted onHide, onShow } from 'vue'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUnmounted(() => {
      console.log('onUnmounted!')
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

### 不要这样做
1. setup 不能是异步

2. `useEffect`, `useComputed`尽量在setup内做, 如果不是的话,注意做好清除清除监听

1. 在未来某个时间 `useEffect`, `useComputed`, 在setup期间执行的监听操作都将绑定在该实例上, 在该实例销毁后, 也会同步取消监听事件, 如果你注册的监听,恰好某个组件执行了setup, 会出现, 他销毁后, 你注册的监听不起效果了, 一开始是不做这样的处理的, 只是为了避免大量的取消监听的写法, 于是做了这样的处理
我也很纠结, 这个问题一旦碰上了, 那就很致命了, 哎, 可是也没有特别好的办法 

---

### 注意
1. 暂不支持 ref 嵌套 ref的情况, 也是可以支持的, 而且容易有问题, 就是 更改最外层的ref的值, 是否会能直接更改里面ref的值, 所以不支持这样


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

### router
tabbler页面