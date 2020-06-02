## 尝试在小程序里使用 composition-api

### 降级版
1. 没有采用 @vue/reactivity 因为 小程序经打点发现目前还有好多用户都不支持 Proxy,Reflect, 于是不采用了(已经有人写好了小程序版composition-api,可以直接用这个)[https://github.com/yangmingshan/vue-mini]
2. 也不打算 Object.defineProperty的方式 例如mobx4 ,经典老问题 ,为了避免使用的时候,如果没有经验的,对象新增属性上操作困扰,目前而言小程序中凭空添加对象属性还是多的,为了避免繁琐,用最简单的方式来吧
3. 理论上应该没有基础库兼容问题

### 思考1
setup触发 是一开始小程序加载就触发,用来初始化数据,还是 onLoad,attached 来触发, 如果是onLoad来触发,setup里面注册onLoad事件,感觉有点奇怪

### 差异
1. setup this执行是组件的实例
2. 自定义组件setup执行是在attached, 尽管create更早, 但是为了获取props, 所以就采用了attached了, props接下来需要ref化
3. useCompute, useEffect, 没有采用 Object.defineProperty 做依赖收集, 由开发者手动做依赖收集
4. 其实可以尝试用 Object.defineProperty, 针对array, object 等提供特殊方法, 只是别忘记就好


```js
import { defineComponent } from '';

defineComponent({
    setup(props) {

        // data
        const [ name, setName ] = useRef('along');
        setName('along1');

        // 计算属性
        const sayName = useCompute(() => {
            return '我名字叫' + name.value
        }, [ name ]);

        /** 注意,也是 .value */
        sayName.value

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
    const pageStatus = ref({
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
        pageStatus.value.loadStatus.isLoading = true;
        try {
            await api(Object.assign({ page: pageStatus.value.page, pageSize: pageStatus.value.pageSize }, params));
            pageStatus.value.page++;
        } catch (e) {
            pageStatus.value.loadStatus.isError = true;
        } finally {
            pageStatus.value.loadStatus.isLoading = false;
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
        const { pageStatus, searchList } = useSearchList();
        const renderList = () => {
            await searchList(api.pack.getList, {}, {});
        }

        onLoad((props) => {

        })

        onShow(() => {

        })

        return {
            pageStatus,
            renderList
        }
    }
})

```