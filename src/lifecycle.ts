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

export const enum ExtendLefecycle {
    EFFECT = 'effect'
}

export function injectHook (
	currentInstance: ICurrentModuleInstance,
	lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle,
	hook: Function
){
	const hiddenField = createShortName(lifecycle)
	if (currentInstance[hiddenField] === undefined) {
		currentInstance[hiddenField] = []
	}

	currentInstance[hiddenField].push(hook)
}

export function conductHook (
	currentInstance: ICurrentModuleInstance,
	lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle,
	params: any[]
){
	const hiddenField = createShortName(lifecycle)
	const injectLifes: Function[] = currentInstance[hiddenField] || []

	return injectLifes.map((life) => typeof life === 'function' && life.apply(this, params))
}

function createCurrentModuleHook (lifecycle: ComponentLifecycle | PageLifecycle){
	return function (callback: Function){
		overInCurrentModule((currentInstance) => {
			currentInstance && injectHook(currentInstance, lifecycle, callback)
		})
	}
}

/** 实例初始化 */
export const onAttached = createCurrentModuleHook(ComponentLifecycle.ATTACHED)

/** 装载完成 */
export const onReady = createCurrentModuleHook(ComponentLifecycle.READY)

/** 卸载 */
export const onDetached = createCurrentModuleHook(ComponentLifecycle.DETACHED)

/** 页面加载 */
export const onLoad = createCurrentModuleHook(PageLifecycle.ON_LOAD)

/** 页面显示 */
export const onShow = createCurrentModuleHook(PageLifecycle.ON_SHOW)

/** 页面隐藏 */
export const onHide = createCurrentModuleHook(PageLifecycle.ON_HIDE)

/** 页面卸载 */
export const onUnload = createCurrentModuleHook(PageLifecycle.ON_UNLOAD)

/** 下拉刷新 */
export const onPullDownRefresh = createCurrentModuleHook(PageLifecycle.ON_PULL_DOWN_REFRESH)

/** 滚动到底部 */
export const onReachBottom = createCurrentModuleHook(PageLifecycle.ON_REACH_BOTTOM)

/** 转发 */
export const onShareAppMessage = createCurrentModuleHook(PageLifecycle.ON_SHARE_APP_MESSAGE)

/** 页面滚动 */
export const onPageScroll = createCurrentModuleHook(PageLifecycle.ON_PAGE_SCROLL)
