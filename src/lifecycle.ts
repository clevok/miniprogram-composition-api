import { createShortName } from './utils'
import { ICurrentModuleInstance, getCurrentInstance } from './instance'

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

/**
 * 返回的函数 this指向必须是 页面或组件
 * @param lifecycle
 * @param options - 页面构造对象 / 或者原方法
 * @return {function} - 新方法, 用于指向所有的注入的声明周期以及原有方法
 */
export function createLifecycleMethods (
	lifecycle: ComponentLifecycle | PageLifecycle,
	options: Object | Function
): (...args: any[]) => any[]{
	const lifeMethod: Function | undefined =
		typeof options === 'function' ? options : options[lifecycle]

	return function (this: ICurrentModuleInstance, ...args: any[]){
		const injectLifes: Function[] = this[createShortName(lifecycle)] || []

		if (lifeMethod) {
			injectLifes.push(lifeMethod)
		}

		return injectLifes.map((life) => life && life.apply(this, ...args))
	}
}

function createCurrentModuleLife (lifecycle: ComponentLifecycle | PageLifecycle){
	return function (callback: Function){
		const currentInstance = getCurrentInstance()
		if (currentInstance) {
			const injectLifes = currentInstance[createShortName(lifecycle)] || []
			injectLifes.push(callback)
		}
	}
}

/** 实例初始化 */
export const onAttached = createCurrentModuleLife(ComponentLifecycle.ATTACHED)

/** 装载完成 */
export const onReady = createCurrentModuleLife(ComponentLifecycle.READY)

/** 卸载 */
export const onDetached = createCurrentModuleLife(ComponentLifecycle.DETACHED)

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
