import { deepToRaw, deepWatch } from './shared'
import { isFunction } from './utils'


export const enum ComponentLifecycle {
	CREATED = 'created',
	ATTACHED = 'attached',
	READY = 'ready',
	DETACHED = 'detached'
}

export const enum PageLifecycle {
	ON_LOAD = 'onLoad',
	ON_SHOW = 'onShow',
	ON_READY = 'onReady',
	ON_HIDE = 'onHide',
	ON_UNLOAD = 'onUnload',
	ON_PULL_DOWN_REFRESH = 'onPullDownRefresh',
	ON_REACH_BOTTOM = 'onReachBottom',
	ON_PAGE_SCROLL = 'onPageScroll',
	ON_SHARE_APP_MESSAGE = 'onShareAppMessage',
	ON_RESIZE = 'onResize',
	ON_TAB_ITEM_TAP = 'onTabItemTap'
}

export type CurrentModuleInstance =
	| WechatMiniprogram.Component.InstanceProperties &
			WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
				[key: string]: any
			}
	| WechatMiniprogram.Page.InstanceProperties &
			WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
				[key: string]: any
			}

/**
 * 执行期间的页面
 */
export let currentModule: CurrentModuleInstance | null = null

export function overCurrentModule<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (){
		currentModule = this

		const reuslt = callback.apply(this, arguments)

		currentModule = null

		return reuslt
	}
}

function overInCurrentModule(callback: (params: CurrentModuleInstance) => void) {
    if (currentModule) {
        callback.call(this, currentModule)
    }
    callback = null;
}

/**
 * 
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
export const setup = overCurrentModule(function (target, callback: Function, props: unknown = {}){
	const binding = callback.call(target, props)
	const stopHandels = Object.keys(binding).map((key) => {
		const value = binding[key]

		if (isFunction(value)) {
			target[key] = value
			return
		}

		target.setData({
			[key]: deepToRaw(value)
		})

		return deepWatch(target, key, value)
	})

	return () => {
		stopHandels.forEach((stopHandle) => {
			stopHandle && stopHandle()
		})
	}
})

function lifecycleName (name: string){
	return `__${name}__`
}

function injectLifecyle (
	target: CurrentModuleInstance,
	lifecycle: ComponentLifecycle | PageLifecycle,
	callback: Function
){
	const life = lifecycleName(lifecycle)
	if (target[life] === void 0) {
		target[life] = []
	}

	target[life].push(callback)
}

/**
 * 实例初始化
 */
export function attached(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, ComponentLifecycle.ATTACHED, callback)
    })
}

/**
 * 装载完成
 */
export function ready (callback: Function){
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, ComponentLifecycle.READY, callback)
    })
}

/**
 * 卸载
 */
export function detached(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, ComponentLifecycle.DETACHED, callback)
    })
}

/**
 * 页面加载
 */
export function onLoad(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_LOAD, callback)
    })
}

/**
 * 页面显示
 */
export function onShow(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_SHOW, callback)
    })
}

/**
 * 页面隐藏
 */
export function onHide(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_HIDE, callback)
    })
}

/**
 * 页面卸载
 */
export function onUnload(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_UNLOAD, callback)
    })
}

/**
 * 下拉刷新
 */
export function onPullDownRefresh(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_PULL_DOWN_REFRESH, callback)
    })
}

/**
 * 滚动到底部
 */
export function onReachBottom(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_REACH_BOTTOM, callback)
    })
}
/**
 * 转发
 */
export function onShareAppMessage(callback: Function) {
    overInCurrentModule((currentModule) => {
        injectLifecyle(currentModule, PageLifecycle.ON_SHARE_APP_MESSAGE, callback)
    })
}