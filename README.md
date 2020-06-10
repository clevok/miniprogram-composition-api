## 尝试在小程序里使用 composition-api

### 缺点
1. 更新属性虽然很烦, 没有采用 Object.defineProperty(为了减少 属性添加删除上疑惑) 做监听, 也没有采用Proxy(版本问题)
    1.1 1导致 useCompute, useEffect 都需要开发者主动声明依赖
2. props 还没有做代理

### 为了什么
1. 替代 mixins, 代码复用新方案
2. 全局状态管理, 计算属性, watch 版本要求不高()
3. 解决页面状态一旦props很多地方,很深就很烦
4. data, methods 不再分散 


### 降级版
1. 没有采用 @vue/reactivity 因为 小程序经打点发现目前还有好多用户都不支持 Proxy,Reflect, 于是不采用了(已经有人写好了小程序版composition-api,可以直接用这个)[https://github.com/yangmingshan/vue-mini]
2. 也不打算 Object.defineProperty 的方式 例如mobx4 ,经典老问题 ,为了避免使用的时候,如果没有经验的,对象新增属性上操作困扰,目前而言小程序中凭空添加对象属性还是多的, 主要为了少增加api, 增加负担
3. 理论上应该没有基础库兼容问题


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
需要一个能 根据 key 实现缓存组件的效果, 多个同一个key 的组件共享状态, 声明周期也不应该重复触发
参考之前的hooks的那个声明周期,可以实现类似的

### 要修正的
1. props也做掉
2. setup允许异步?
3. watch, computed收集的依赖在页面/组件销毁时也要一起注销

```js

const [ disable ] = useRef(false);
useRef([
    {
        disable: disable 
    }
])

```


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

### 解决的问题
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
