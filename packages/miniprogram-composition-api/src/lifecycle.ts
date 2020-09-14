import { createShortName } from './utils'
import { ICurrentModuleInstance, overInCurrentModule } from './instance'

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

export const enum CommonLifecycle {
    ON_LOAD = 'onLoad',
    ON_UN_LOAD = 'onUnload',
    ON_READY = 'onReady'
}

export const enum ExtendLefecycle {
    EFFECT = 'effect',
    WATCH_PROPERTY = 'watchProperty'
}

/**注入hooks */
export function injectHook (
	currentInstance: ICurrentModuleInstance,
	lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle | CommonLifecycle,
	hook: Function
){
	const hiddenField = createShortName(lifecycle)
	if (currentInstance[hiddenField] === undefined) {
		currentInstance[hiddenField] = []
	}

	currentInstance[hiddenField].push(hook)
}

/**执行hooks */
export function conductHook (
	currentInstance: ICurrentModuleInstance,
	lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle | CommonLifecycle,
	params: any[]
){
	const hiddenField = createShortName(lifecycle)
	const injectLifes: Function[] = currentInstance[hiddenField] || []

	return injectLifes.map((life) => typeof life === 'function' && life.apply(currentInstance, params))
}

function createCurrentModuleHook (lifecycle: ComponentLifecycle | PageLifecycle | CommonLifecycle){
	return function (callback: Function){
		overInCurrentModule((currentInstance) => {
			currentInstance && injectHook(currentInstance, lifecycle, callback)
		})
	}
}

/** 实例被加载, Page.onLoad, Components.attached */
export const onLoad = createCurrentModuleHook(CommonLifecycle.ON_LOAD)

/** 实例被销毁, Page.onUnLoad, Components.destory */
export const onUnLoad = createCurrentModuleHook(CommonLifecycle.ON_UN_LOAD)

/** 实例装载完成, Page.onReady, Components.ready */
export const onReady = createCurrentModuleHook(CommonLifecycle.ON_READY)

/** 页面显示 */
export const onShow = createCurrentModuleHook(PageLifecycle.ON_SHOW)

/** 页面隐藏 */
export const onHide = createCurrentModuleHook(PageLifecycle.ON_HIDE)

/** 下拉刷新 */
export const onPullDownRefresh = createCurrentModuleHook(PageLifecycle.ON_PULL_DOWN_REFRESH)

/** 滚动到底部 */
export const onReachBottom = createCurrentModuleHook(PageLifecycle.ON_REACH_BOTTOM)

/** 转发 */ 
export const onShareAppMessage = createCurrentModuleHook(PageLifecycle.ON_SHARE_APP_MESSAGE)

/** 页面滚动 */
export const onPageScroll = createCurrentModuleHook(PageLifecycle.ON_PAGE_SCROLL)
