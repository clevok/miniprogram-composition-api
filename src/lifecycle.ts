import { deepToRaw, deepWatch } from './shared'
import { isFunction, createShortName, wrapFuns, wrapFun, runFun } from './utils'

/**
 * 执行期间的页面
 */
let currentModule: CurrentModuleInstance | null = null

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
 * 接受第一个参数是 current对象
 * @param callback 
 */
export function overCurrentModule<T extends Function> (callback: T): T{
	// @ts-ignore
	return function (target: CurrentModuleInstance, ...arg: any[]){
		currentModule = target

		const reuslt = callback.call(target, target, ...arg)

		currentModule = null

		return reuslt
	}
}

/**
 * 
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
export const setup = overCurrentModule(function (
	target: CurrentModuleInstance,
	callback: Function,
	props: unknown = {}
){
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

function injectLifecyle (
	target: CurrentModuleInstance,
	lifecycle: ComponentLifecycle | PageLifecycle,
	callback: Function
){
	const life = createShortName(lifecycle)
	if (target[life] === void 0) {
		target[life] = []
	}

	target[life].push(callback)
}

export function runLifecycle (
	target: CurrentModuleInstance,
	lifecycle: ComponentLifecycle | PageLifecycle
){
	const life = createShortName(lifecycle)
	return target[life] &&
        target[life].map((fun) => {
            return runFun.call(target, fun)
		})
}

function createCurrentModuleLife (lifecycle: ComponentLifecycle | PageLifecycle){
	return function (callback: Function){
		if (currentModule) {
			injectLifecyle(currentModule, lifecycle, callback)
		}
	}
}

/** 实例初始化 */
export const attached = createCurrentModuleLife(ComponentLifecycle.ATTACHED)

/** 装载完成 */
export const ready = createCurrentModuleLife(ComponentLifecycle.READY)

/** 卸载 */
export const detached = createCurrentModuleLife(ComponentLifecycle.DETACHED)

/** 页面加载 */
export const onLoad = createCurrentModuleLife(PageLifecycle.ON_LOAD)

/** 页面显示 */
export const onShow = createCurrentModuleLife(PageLifecycle.ON_SHOW)

/** 页面隐藏 */
export const onHide = createCurrentModuleLife(PageLifecycle.ON_HIDE)

/** 页面卸载 */
export const onUnload = createCurrentModuleLife(PageLifecycle.ON_UNLOAD)

/** 下拉刷新 */
export const onPullDownRefresh = createCurrentModuleLife(PageLifecycle.ON_PULL_DOWN_REFRESH)

/** 滚动到底部 */
export const onReachBottom = createCurrentModuleLife(PageLifecycle.ON_REACH_BOTTOM)

/** 转发 */
export const onShareAppMessage = createCurrentModuleLife(PageLifecycle.ON_SHARE_APP_MESSAGE)

/** 页面滚动 */
export const onPageScroll = createCurrentModuleLife(PageLifecycle.ON_PAGE_SCROLL)